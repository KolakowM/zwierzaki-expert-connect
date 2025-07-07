
-- Update the package_stripe_prices table with the correct Stripe price ID for Advanced monthly
UPDATE package_stripe_prices 
SET stripe_price_id = 'price_1Rfkh7H74CzZDu9dxLQgdsmk'
WHERE package_id = (SELECT id FROM packages WHERE name = 'Advanced' LIMIT 1)
AND billing_period = 'monthly';

-- Add some placeholder price IDs for other plans (you can update these later with real ones)
UPDATE package_stripe_prices 
SET stripe_price_id = 'price_advanced_yearly_placeholder'
WHERE package_id = (SELECT id FROM packages WHERE name = 'Advanced' LIMIT 1)
AND billing_period = 'yearly';

UPDATE package_stripe_prices 
SET stripe_price_id = 'price_professional_monthly_placeholder'
WHERE package_id = (SELECT id FROM packages WHERE name = 'Professional' LIMIT 1)
AND billing_period = 'monthly';

UPDATE package_stripe_prices 
SET stripe_price_id = 'price_professional_yearly_placeholder'
WHERE package_id = (SELECT id FROM packages WHERE name = 'Professional' LIMIT 1)
AND billing_period = 'yearly';
