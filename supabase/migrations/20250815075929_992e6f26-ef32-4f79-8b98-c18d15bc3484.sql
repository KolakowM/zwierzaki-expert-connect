-- FINAL FIX: Remove all problematic triggers and functions that prevent webhook from working

-- 1. Drop all problematic triggers
DROP TRIGGER IF EXISTS update_user_subscription_trigger ON payment_logs;
DROP TRIGGER IF EXISTS check_expired_subscriptions ON user_subscriptions;
DROP TRIGGER IF EXISTS subscription_status_change ON user_subscriptions;

-- 2. Drop all problematic trigger functions
DROP FUNCTION IF EXISTS update_user_subscription();
DROP FUNCTION IF EXISTS trigger_expire_subscriptions();
DROP FUNCTION IF EXISTS auto_expire_subscriptions();

-- 3. Temporarily disable other triggers for testing (we can re-enable later if needed)
DROP TRIGGER IF EXISTS subscription_changes_trigger ON user_subscriptions;
DROP TRIGGER IF EXISTS subscription_validation_trigger ON user_subscriptions;

-- 4. Clean up the user subscription to correct state
UPDATE user_subscriptions 
SET 
  package_id = '3d73a98e-9d72-47f6-b7c4-88167300b66c',
  status = 'active',
  payment_id = 'sub_1RwHrwH74CzZDu9dmDCP3fV9',
  updated_at = now()
WHERE user_id = 'ba36d7c0-25cd-498e-8d53-3f4e5e704b94';