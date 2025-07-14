
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

    const { packageId, billingPeriod, couponCode } = await req.json();
    console.log('Request parameters:', { packageId, billingPeriod, couponCode });

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

    // Validate coupon if provided
    let validatedCoupon = null;
    if (couponCode) {
      console.log('=== COUPON VALIDATION START ===');
      console.log('Validating coupon:', couponCode);
      
      try {
        // 1. Validate coupon with Stripe
        const coupon = await stripe.coupons.retrieve(couponCode);
        console.log('Stripe coupon retrieved:', {
          id: coupon.id,
          valid: coupon.valid,
          metadata: coupon.metadata,
          percent_off: coupon.percent_off,
          amount_off: coupon.amount_off,
          currency: coupon.currency,
          duration: coupon.duration,
          duration_in_months: coupon.duration_in_months,
          max_redemptions: coupon.max_redemptions,
          times_redeemed: coupon.times_redeemed,
          redeem_by: coupon.redeem_by
        });
        
        if (!coupon.valid) {
          console.log('Coupon validation failed: Coupon is not valid or has expired');
          throw new Error('Coupon is not valid or has expired');
        }

        // 2. Check billing period restrictions (using coupon metadata)
        console.log('=== BILLING PERIOD CHECK ===');
        console.log('Current billing period:', billingPeriod);
        console.log('Coupon metadata:', coupon.metadata);
        
        if (coupon.metadata && coupon.metadata.allowed_billing_periods) {
          console.log('Found allowed_billing_periods in metadata:', coupon.metadata.allowed_billing_periods);
          const allowedPeriods = coupon.metadata.allowed_billing_periods.split(',').map(p => p.trim());
          console.log('Parsed allowed periods:', allowedPeriods);
          
          if (!allowedPeriods.includes(billingPeriod)) {
            const errorMsg = `This coupon is not valid for ${billingPeriod} billing. Allowed periods: ${allowedPeriods.join(', ')}`;
            console.log('Billing period validation failed:', errorMsg);
            throw new Error(errorMsg);
          }
          console.log('Billing period validation passed');
        } else {
          console.log('No billing period restrictions found in coupon metadata');
        }

        // 3. Check if user has already used this coupon
        console.log('=== USAGE CHECK ===');
        const supabaseService = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { data: existingUsage, error: usageError } = await supabaseService
          .from('payment_logs')
          .select('id')
          .eq('user_id', user.id)
          .contains('metadata', { coupon_code: couponCode })
          .limit(1);

        if (usageError) {
          console.error('Error checking coupon usage:', usageError);
          throw new Error('Failed to validate coupon usage');
        }

        console.log('Existing usage check result:', { existingUsage, count: existingUsage?.length || 0 });

        if (existingUsage && existingUsage.length > 0) {
          console.log('Coupon usage validation failed: User has already used this coupon');
          throw new Error('You have already used this coupon code');
        }

        validatedCoupon = coupon;
        console.log('Coupon validation completed successfully');
        
      } catch (error) {
        console.error('Coupon validation failed with error:', error);
        throw new Error(`Coupon validation failed: ${error.message}`);
      }
      
      console.log('=== COUPON VALIDATION END ===');
    }

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
    const sessionConfig = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: !couponCode, // Disable promotion code field if coupon is pre-applied
      success_url: `${req.headers.get("origin")}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      metadata: {
        package_id: packageId,
        user_id: user.id,
        billing_period: billingPeriod,
        ...(couponCode && { coupon_code: couponCode }),
      },
    };

    console.log('Session config before coupon application:', {
      ...sessionConfig,
      line_items: sessionConfig.line_items.map(item => ({ price: item.price, quantity: item.quantity }))
    });

    // Apply coupon if validated
    if (validatedCoupon) {
      console.log('=== APPLYING COUPON TO SESSION ===');
      sessionConfig.discounts = [{
        coupon: couponCode,
      }];
      console.log('Applied coupon discount:', { coupon: couponCode });
    }

    console.log('Final session config:', {
      ...sessionConfig,
      line_items: sessionConfig.line_items.map(item => ({ price: item.price, quantity: item.quantity })),
      discounts: sessionConfig.discounts || 'none'
    });

    // Create checkout session
    console.log('=== CREATING STRIPE CHECKOUT SESSION ===');
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('Checkout session created:', {
      id: session.id,
      url: session.url ? 'present' : 'missing',
      discounts: session.discounts || 'none',
      total_details: session.total_details
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

    // Log payment attempt with coupon information
    const paymentLogMetadata = {
      billing_period: billingPeriod,
      ...(couponCode && { 
        coupon_code: couponCode,
        coupon_applied: true,
        coupon_type: validatedCoupon?.percent_off ? 'percent' : 'amount',
        coupon_value: validatedCoupon?.percent_off || validatedCoupon?.amount_off,
      }),
    };

    console.log('=== LOGGING PAYMENT ATTEMPT ===');
    console.log('Payment log metadata:', paymentLogMetadata);

    await supabaseService.from("payment_logs").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      package_id: packageId,
      status: 'pending',
      metadata: paymentLogMetadata,
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
