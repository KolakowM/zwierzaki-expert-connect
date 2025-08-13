-- Cleanup subscription-related data and enforce unique constraints for deterministic upserts
BEGIN;
  -- Remove test and inconsistent records
  DELETE FROM public.payment_logs;
  DELETE FROM public.subscription_audit;
  DELETE FROM public.user_addons;
  DELETE FROM public.user_subscriptions;
  DELETE FROM public.subscribers;
COMMIT;

-- Ensure deterministic upserts
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_unique ON public.subscribers (email);
CREATE UNIQUE INDEX IF NOT EXISTS user_subscriptions_user_id_unique ON public.user_subscriptions (user_id);
