
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Map package using Stripe price_id via package_stripe_prices
      const priceId = subscription.items.data[0].price.id;

      // Try to map price_id -> package_id using database mapping
      const { data: priceMap, error: priceMapError } = await supabaseClient
        .from('package_stripe_prices')
        .select('package_id')
        .eq('stripe_price_id', priceId)
        .eq('is_active', true)
        .maybeSingle();

      let mappedPackageId: string | null = priceMap?.package_id ?? null;
      let mappedPackageName: string | null = null;

      if (!mappedPackageId) {
        // Fallback to legacy amount-based mapping (kept for resilience)
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        if (amount <= 4900) {
          subscriptionTier = "Advanced";
        } else if (amount <= 9900) {
          subscriptionTier = "Professional";
        } else {
          subscriptionTier = "Enterprise";
        }
        logStep("Fallback tier determined by amount", { priceId, amount, subscriptionTier });

        const { data: fallbackPackage } = await supabaseClient
          .from('packages')
          .select('id,name')
          .eq('name', subscriptionTier)
          .maybeSingle();
        if (fallbackPackage) {
          mappedPackageId = fallbackPackage.id;
          mappedPackageName = fallbackPackage.name;
        }
      } else {
        // Resolve package name for nicer display in subscribers.subscription_tier
        const { data: pkg } = await supabaseClient
          .from('packages')
          .select('id,name')
          .eq('id', mappedPackageId)
          .maybeSingle();
        mappedPackageName = pkg?.name ?? null;
        subscriptionTier = mappedPackageName;
        logStep("Mapped package via price_id", { priceId, packageId: mappedPackageId, packageName: mappedPackageName });
      }

      if (mappedPackageId) {
        // Update user_subscriptions table using mapped package
        await supabaseClient.from("user_subscriptions").upsert({
          user_id: user.id,
          package_id: mappedPackageId,
          status: 'active',
          start_date: new Date(subscription.created * 1000).toISOString(),
          end_date: subscriptionEnd,
          payment_id: subscription.id,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      }
    } else {
      logStep("No active subscription found");
    }

    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: hasActiveSub ? subscriptions.data[0].id : null,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
