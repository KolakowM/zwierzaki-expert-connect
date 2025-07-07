
-- Update package_stripe_prices table with correct package names and price mappings
DELETE FROM package_stripe_prices;

-- Insert correct mappings for Advanced and Professional packages
INSERT INTO package_stripe_prices (package_id, stripe_price_id, billing_period) VALUES
-- Advanced package mappings
((SELECT id FROM packages WHERE name = 'Advanced' LIMIT 1), 'price_1QWpjgRsQVdJNyQN5rVDgmAx', 'monthly'),
((SELECT id FROM packages WHERE name = 'Advanced' LIMIT 1), 'price_1QWpjgRsQVdJNyQNPOlUHFZW', 'yearly'),
-- Professional package mappings  
((SELECT id FROM packages WHERE name = 'Professional' LIMIT 1), 'price_1QWpkORsQVdJNyQN7c2jBZjG', 'monthly'),
((SELECT id FROM packages WHERE name = 'Professional' LIMIT 1), 'price_1QWpkORsQVdJNyQNgKnmLg1Z', 'yearly');

-- Create or update subscribers table for better Stripe integration
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for subscribers
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
DROP POLICY IF EXISTS "select_own_subscription" ON subscribers;
CREATE POLICY "select_own_subscription" ON subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
DROP POLICY IF EXISTS "update_own_subscription" ON subscribers;
CREATE POLICY "update_own_subscription" ON subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
DROP POLICY IF EXISTS "insert_subscription" ON subscribers;
CREATE POLICY "insert_subscription" ON subscribers
FOR INSERT
WITH CHECK (true);
