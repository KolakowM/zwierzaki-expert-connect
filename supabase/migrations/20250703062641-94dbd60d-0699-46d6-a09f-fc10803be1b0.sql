
-- Create package_stripe_prices table to map packages to Stripe price IDs
CREATE TABLE public.package_stripe_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  stripe_price_id TEXT NOT NULL,
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(package_id, billing_period)
);

-- Add RLS policies for package_stripe_prices
ALTER TABLE public.package_stripe_prices ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active stripe prices
CREATE POLICY "Anyone can view active stripe prices" 
  ON public.package_stripe_prices 
  FOR SELECT 
  USING (is_active = true);

-- Only admins can modify stripe prices
CREATE POLICY "Only admins can modify stripe prices" 
  ON public.package_stripe_prices 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ));

-- Create subscribers table for Stripe subscription tracking
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Insert sample Stripe price data for existing packages
INSERT INTO public.package_stripe_prices (package_id, stripe_price_id, billing_period) 
SELECT 
  p.id,
  CASE 
    WHEN p.name = 'Advanced' AND 'monthly' = 'monthly' THEN 'price_advanced_monthly'
    WHEN p.name = 'Advanced' AND 'yearly' = 'yearly' THEN 'price_advanced_yearly'
    WHEN p.name = 'Professional' AND 'monthly' = 'monthly' THEN 'price_professional_monthly'
    WHEN p.name = 'Professional' AND 'yearly' = 'yearly' THEN 'price_professional_yearly'
  END as stripe_price_id,
  billing_period
FROM packages p
CROSS JOIN (VALUES ('monthly'), ('yearly')) AS periods(billing_period)
WHERE p.name IN ('Advanced', 'Professional') AND p.is_active = true;

-- Add payment tracking table for better audit trail
CREATE TABLE public.payment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_session_id TEXT,
  stripe_subscription_id TEXT,
  package_id UUID REFERENCES packages(id),
  amount_cents INTEGER,
  currency TEXT DEFAULT 'pln',
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS for payment logs
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment logs
CREATE POLICY "Users can view own payment logs" 
  ON public.payment_logs 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Admins can view all payment logs
CREATE POLICY "Admins can view all payment logs" 
  ON public.payment_logs 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ));

-- System can insert payment logs
CREATE POLICY "System can insert payment logs" 
  ON public.payment_logs 
  FOR INSERT 
  WITH CHECK (true);
