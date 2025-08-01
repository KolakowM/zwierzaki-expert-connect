
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== CREATE CHECKOUT SESSION DEBUG START ===');
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    console.log('User authenticated:', { userId: user.id, email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const { packageId, billingPeriod } = await req.json();
    console.log('Request parameters:', { packageId, billingPeriod });

    // Get the Stripe price ID for this package and billing period
    const { data: priceData, error: priceError } = await supabaseClient
      .from('package_stripe_prices')
      .select('stripe_price_id')
      .eq('package_id', packageId)
      .eq('billing_period', billingPeriod)
      .eq('is_active', true)
      .single();

    if (priceError || !priceData) {
      console.error('Error fetching price:', priceError);
      throw new Error('No Stripe price found for this package');
    }

    const stripePriceId = priceData.stripe_price_id;
    console.log('Found Stripe price ID:', stripePriceId);

    // Check if customer exists
    console.log('=== CUSTOMER CHECK ===');
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('Found existing customer:', customerId);
    } else {
      // Create new customer
      console.log('Creating new customer for email:', user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
      console.log('Created new customer:', customerId);
    }

    // Create checkout session configuration
    console.log('=== CHECKOUT SESSION CONFIG ===');
    const sessionConfig: any = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true, // Enable promotion codes on Stripe checkout page
      success_url: `${req.headers.get("origin")}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      metadata: {
        package_id: packageId,
        user_id: user.id,
        billing_period: billingPeriod,
      },
    };

    console.log('Session config:', {
      ...sessionConfig,
      line_items: sessionConfig.line_items.map((item: any) => ({ price: item.price, quantity: item.quantity })),
    });

    // Create checkout session
    console.log('=== CREATING STRIPE CHECKOUT SESSION ===');
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('Checkout session created:', {
      id: session.id,
      url: session.url ? 'present' : 'missing'
    });

    // Update or create subscriber record
    console.log('=== UPDATING SUBSCRIBER RECORD ===');
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseService.from("subscribers").upsert({
      user_id: user.id,
      email: user.email,
      stripe_customer_id: customerId,
      subscribed: false, // Will be updated via webhook
      subscription_tier: packageId,
    });

    // Log payment attempt
    console.log('=== LOGGING PAYMENT ATTEMPT ===');
    await supabaseService.from("payment_logs").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      package_id: packageId,
      status: 'pending',
      metadata: {
        billing_period: billingPeriod
      },
    });

    console.log('Checkout session created successfully:', session.id);
    console.log('=== CREATE CHECKOUT SESSION DEBUG END ===');

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("=== ERROR IN CREATE CHECKOUT ===");
    console.error("Error creating checkout session:", error);
    console.error("Error stack:", error.stack);
    console.error("=== ERROR END ===");
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
