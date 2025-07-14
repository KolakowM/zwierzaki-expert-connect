
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getStripePriceForPackage, logPayment } from '@/services/stripeService';

export const useStripePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = async (
    packageId: string, 
    billingPeriod: 'monthly' | 'yearly',
    stripeCouponId?: string
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue with payment",
        variant: "destructive",
      });
      return;
    }

    console.log('=== FRONTEND CHECKOUT DEBUG START ===');
    console.log('Request parameters:', { packageId, billingPeriod, stripeCouponId });

    setIsLoading(true);
    try {
      // Get the Stripe price ID for this package and billing period
      const stripePriceId = await getStripePriceForPackage(packageId, billingPeriod);
      console.log('Retrieved Stripe price ID:', stripePriceId);
      
      if (!stripePriceId) {
        throw new Error('No Stripe price found for this package');
      }

      const requestBody = { 
        packageId, 
        billingPeriod,
        stripePriceId,
        stripeCouponId
      };
      
      console.log('Sending request to create-checkout with body:', requestBody);

      // Call the edge function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: requestBody
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Checkout session URL received, opening in new tab');
        
        // Log the payment attempt
        await logPayment({
          user_id: user.id,
          stripe_session_id: data.sessionId,
          package_id: packageId,
          status: 'pending',
          metadata: { 
            billing_period: billingPeriod,
            coupon_applied: !!stripeCouponId
          }
        });

        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to Payment",
          description: stripeCouponId 
            ? "You've been redirected to Stripe checkout with your coupon applied!" 
            : "You've been redirected to Stripe checkout in a new tab.",
        });
      }
    } catch (error) {
      console.error('=== FRONTEND CHECKOUT ERROR ===');
      console.error('Error creating checkout session:', error);
      const errorMessage = error?.message || 'Failed to initiate payment process';
      console.error('Error message to display:', errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('=== FRONTEND CHECKOUT DEBUG END ===');
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Opening Customer Portal",
          description: "Manage your subscription in the new tab",
        });
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management portal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    openCustomerPortal,
    isLoading,
  };
};
