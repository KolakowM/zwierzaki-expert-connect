
import { supabase } from "@/integrations/supabase/client";

export interface StripePrice {
  id: string;
  package_id: string;
  stripe_price_id: string;
  billing_period: 'monthly' | 'yearly';
  is_active: boolean;
}

export const getStripePrices = async (): Promise<StripePrice[]> => {
  const { data, error } = await supabase
    .from('package_stripe_prices')
    .select('*')
    .eq('is_active', true)
    .order('billing_period');

  if (error) throw error;
  
  // Type cast the billing_period to ensure it matches our union type
  return (data || []).map(item => ({
    ...item,
    billing_period: item.billing_period as 'monthly' | 'yearly'
  }));
};

export const getStripePriceForPackage = async (
  packageId: string, 
  billingPeriod: 'monthly' | 'yearly'
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('package_stripe_prices')
    .select('stripe_price_id')
    .eq('package_id', packageId)
    .eq('billing_period', billingPeriod)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching Stripe price:', error);
    return null;
  }
  
  return data?.stripe_price_id || null;
};

export const logPayment = async (paymentData: {
  user_id: string;
  stripe_session_id?: string;
  stripe_subscription_id?: string;
  package_id?: string;
  amount_cents?: number;
  currency?: string;
  status: string;
  metadata?: Record<string, any>;
}) => {
  const { error } = await supabase
    .from('payment_logs')
    .insert([{
      ...paymentData,
      metadata: paymentData.metadata || {}
    }]);

  if (error) {
    console.error('Error logging payment:', error);
    throw error;
  }
};
