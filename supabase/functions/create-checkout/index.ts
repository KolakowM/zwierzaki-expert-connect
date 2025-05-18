
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
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Parse request body
    const { billingPeriod, planName } = await req.json();
    logStep("Request parsed", { billingPeriod, planName });

    // Create Supabase client with anon key for auth verification
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    logStep("Stripe initialized");

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No customer found, will be created during checkout");
    }

    // Get price ID based on plan and billing period
    let priceId;
    let amount;
    let interval;
    
    // Determine pricing details based on plan and billing period
    if (planName === "Zaawansowany") {
      if (billingPeriod === "monthly") {
        amount = 4900; // 49 PLN
        interval = "month";
      } else {
        amount = 49000; // 490 PLN
        interval = "year";
      }
    } else if (planName === "Zawodowiec") {
      if (billingPeriod === "monthly") {
        amount = 9900; // 99 PLN
        interval = "month";
      } else {
        amount = 99000; // 990 PLN
        interval = "year";
      }
    } else {
      throw new Error("Invalid plan name");
    }

    logStep("Price determined", { planName, billingPeriod, amount, interval });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: { 
              name: `PetsFlow - Plan ${planName}`,
              description: `Subskrypcja ${billingPeriod === "monthly" ? "miesięczna" : "roczna"}` 
            },
            unit_amount: amount, // Amount in subunits (grosze)
            recurring: {
              interval: interval === "month" ? "month" : "year"
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?checkout_success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing?checkout_canceled=true`,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Create Supabase client with service role key for database writes
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Upsert record in subscribers table with pending status
    await supabaseAdmin.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscription_tier: planName,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Database updated with pending subscription", { email: user.email, planName });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[CREATE-CHECKOUT] ERROR: ${errorMessage}`);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
