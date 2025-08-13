-- Temporarily disable subscription audit trigger to test user_subscriptions creation
-- This will help us isolate the issue causing user_subscriptions records not to be created

DROP TRIGGER IF EXISTS subscription_audit_trigger ON public.user_subscriptions;