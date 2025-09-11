import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecaptchaVerificationRequest {
  token: string;
  action?: string;
}

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, action = 'register' }: RecaptchaVerificationRequest = await req.json();
    
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token reCAPTCHA jest wymagany' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY');
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY nie jest skonfigurowany');
      return new Response(
        JSON.stringify({ success: false, error: 'Konfiguracja serwera nieprawidłowa' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify token with Google reCAPTCHA API
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verifyData = new URLSearchParams({
      secret: secretKey,
      response: token
    });

    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyData,
    });

    const recaptchaResult: RecaptchaResponse = await verifyResponse.json();
    
    console.log('reCAPTCHA verification result:', {
      success: recaptchaResult.success,
      score: recaptchaResult.score,
      action: recaptchaResult.action,
      errors: recaptchaResult['error-codes']
    });

    // Check if verification was successful
    if (!recaptchaResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Weryfikacja reCAPTCHA nie powiodła się',
          details: recaptchaResult['error-codes'] 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check score (0.0 = bot, 1.0 = human)
    const minScore = 0.5;
    if (recaptchaResult.score < minScore) {
      console.log(`reCAPTCHA score too low: ${recaptchaResult.score} < ${minScore}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Weryfikacja bezpieczeństwa nie powiodła się. Spróbuj ponownie.',
          score: recaptchaResult.score
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify action matches (optional but recommended)
    if (action && recaptchaResult.action !== action) {
      console.log(`Action mismatch: expected ${action}, got ${recaptchaResult.action}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Nieprawidłowa akcja weryfikacji'
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Success!
    return new Response(
      JSON.stringify({ 
        success: true, 
        score: recaptchaResult.score,
        action: recaptchaResult.action
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in verify-recaptcha function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Błąd serwera podczas weryfikacji reCAPTCHA' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});