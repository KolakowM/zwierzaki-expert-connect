
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== VALIDATE COUPON DEBUG START ===');
    
    const { couponCode, priceId } = await req.json();
    console.log('Request parameters:', { couponCode, priceId });

    if (!couponCode || !priceId) {
      throw new Error('Missing couponCode or priceId');
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get coupon information from Stripe
    const promotionCodes = await stripe.promotionCodes.list({
      code: couponCode,
      active: true,
      limit: 1,
    });

    if (promotionCodes.data.length === 0) {
      console.log('Promotion code not found or inactive');
      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'Kod promocyjny nie istnieje lub jest nieaktywny' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const promotionCode = promotionCodes.data[0];
    const coupon = promotionCode.coupon;
    console.log('Found promotion code:', promotionCode.id);
    console.log('Coupon details:', { 
      id: coupon.id, 
      percent_off: coupon.percent_off,
      amount_off: coupon.amount_off 
    });

    // Check coupon restrictions based on name/code
    const isValidForPrice = validateCouponForPrice(couponCode, priceId);
    
    if (!isValidForPrice) {
      console.log('Coupon not valid for this price');
      return new Response(JSON.stringify({ 
        valid: false, 
        error: 'Ten kod promocyjny nie jest ważny dla wybranego planu' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log('Coupon validation successful');
    return new Response(JSON.stringify({ 
      valid: true,
      coupon: {
        id: coupon.id,
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        name: coupon.name
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('=== VALIDATE COUPON ERROR ===');
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      valid: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function validateCouponForPrice(couponCode: string, priceId: string): boolean {
  // Map coupons to specific prices/plans
  const couponRestrictions: Record<string, string[]> = {
    // Coupons for Advanced plan (monthly and yearly)
    'ADVANCED_15': [
      'price_1Rfkh7H74CzZDu9dxLQgdsmk', // monthly
      // Add yearly price_id for Advanced plan here when available
    ],
    'ZAAWANSOWANY15': [
      'price_1Rfkh7H74CzZDu9dxLQgdsmk',
      // Add yearly price_id for Advanced plan here when available
    ],
    // Coupons for Professional plan
    'PRO_15': [
      // Add price_id for monthly Professional plan here when available
      // Add price_id for yearly Professional plan here when available
    ],
    'ZAWODOWIEC15': [
      // Add price_id for monthly Professional plan here when available
      // Add price_id for yearly Professional plan here when available
    ]
  };

  const allowedPrices = couponRestrictions[couponCode.toUpperCase()];
  return allowedPrices ? allowedPrices.includes(priceId) : false;
}
