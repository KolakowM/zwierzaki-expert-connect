-- Temporarily disable the subscription audit trigger to test webhook
DROP TRIGGER IF EXISTS subscription_audit_trigger ON user_subscriptions;