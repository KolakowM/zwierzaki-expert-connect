-- Remove the problematic trigger and function that's preventing webhook updates
DROP TRIGGER IF EXISTS update_user_subscription_trigger ON payment_logs;
DROP FUNCTION IF EXISTS update_user_subscription();

-- Update the user's subscription to the correct package (Zawodowiec based on payment logs)
UPDATE user_subscriptions 
SET 
  package_id = '3d73a98e-9d72-47f6-b7c4-88167300b66c',
  status = 'active',
  payment_id = 'sub_1RwHrwH74CzZDu9dmDCP3fV9',
  updated_at = now()
WHERE user_id = 'ba36d7c0-25cd-498e-8d53-3f4e5e704b94';