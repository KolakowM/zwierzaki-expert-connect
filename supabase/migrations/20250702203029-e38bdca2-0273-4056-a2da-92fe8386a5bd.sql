
-- Add Stripe-related columns to user_subscriptions table
ALTER TABLE user_subscriptions 
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN stripe_price_id TEXT;

-- Create a table to map our packages to Stripe price IDs
CREATE TABLE package_stripe_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES packages(id),
  stripe_price_id TEXT NOT NULL,
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(package_id, billing_period)
);

-- Insert the Stripe price mappings based on your provided price IDs
INSERT INTO package_stripe_prices (package_id, stripe_price_id, billing_period) VALUES
-- Advanced package (assuming this is the middle tier)
((SELECT id FROM packages WHERE name = 'Advanced' LIMIT 1), 'price_1QWpjgRsQVdJNyQN5rVDgmAx', 'monthly'),
((SELECT id FROM packages WHERE name = 'Advanced' LIMIT 1), 'price_1QWpjgRsQVdJNyQNPOlUHFZW', 'yearly'),
-- Professional package (assuming this is the top tier)
((SELECT id FROM packages WHERE name = 'Professional' LIMIT 1), 'price_1QWpkORsQVdJNyQN7c2jBZjG', 'monthly'),
((SELECT id FROM packages WHERE name = 'Professional' LIMIT 1), 'price_1QWpkORsQVdJNyQNgKnmLg1Z', 'yearly');

-- Create subscribers table for Stripe subscription tracking
CREATE TABLE IF NOT EXISTS subscribers (
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

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON subscribers
FOR INSERT
WITH CHECK (true);

-- Add RLS policy for package_stripe_prices (read-only for authenticated users)
ALTER TABLE package_stripe_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_view_package_prices" ON package_stripe_prices
FOR SELECT
USING (true);
