
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    console.log('=== VALIDATE COUPON FUNCTION START ===');
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log('User authenticated:', { userId: user.id, email: user.email });

    const { code, stripePriceId } = await req.json();
    console.log('Validating coupon code:', code, 'for price ID:', stripePriceId);

    if (!code) {
      throw new Error("Coupon code is required");
    }

    // Validate the coupon
    const { data: coupon, error: couponError } = await supabaseClient
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (couponError || !coupon) {
      console.log('Coupon not found or inactive:', couponError);
      return new Response(JSON.stringify({ 
        valid: false, 
        message: "Kod promocyjny nie istnieje lub jest nieaktywny" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log('Found coupon:', { id: coupon.id, code: coupon.code });

    // Check if coupon has expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      console.log('Coupon expired:', coupon.expires_at);
      return new Response(JSON.stringify({ 
        valid: false, 
        message: "Kod promocyjny wygasł" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check usage limits
    if (coupon.max_usage && coupon.usage_count >= coupon.max_usage) {
      console.log('Coupon usage limit reached:', { usage_count: coupon.usage_count, max_usage: coupon.max_usage });
      return new Response(JSON.stringify({ 
        valid: false, 
        message: "Kod promocyjny osiągnął limit użyć" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if coupon is restricted to specific price IDs
    if (stripePriceId && coupon.applicable_stripe_price_ids && coupon.applicable_stripe_price_ids.length > 0) {
      if (!coupon.applicable_stripe_price_ids.includes(stripePriceId)) {
        console.log('Coupon not applicable to this price ID:', { couponPriceIds: coupon.applicable_stripe_price_ids, requestedPriceId: stripePriceId });
        return new Response(JSON.stringify({ 
          valid: false, 
          message: "Ten kod promocyjny nie dotyczy wybranego pakietu" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // Check if user has already used this coupon
    const { data: existingUsage, error: usageError } = await supabaseClient
      .from('coupon_usage')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('user_id', user.id)
      .single();

    if (existingUsage) {
      console.log('User already used this coupon');
      return new Response(JSON.stringify({ 
        valid: false, 
        message: "Już wykorzystałeś ten kod promocyjny" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log('Coupon is valid');
    return new Response(JSON.stringify({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        description: coupon.description,
        stripe_coupon_id: coupon.stripe_coupon_id
      },
      message: "Kod promocyjny jest ważny"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("=== ERROR IN VALIDATE COUPON ===");
    console.error("Error validating coupon:", error);
    console.error("Error stack:", error.stack);
    console.error("=== ERROR END ===");
    
    return new Response(JSON.stringify({ 
      valid: false, 
      message: error.message || "Wystąpił błąd podczas walidacji kodu promocyjnego" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
