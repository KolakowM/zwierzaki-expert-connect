-- Tighten RLS policies for subscriptions and payment logs

-- 1) user_subscriptions: remove overly permissive UPDATE policy
DROP POLICY IF EXISTS "System can update subscriptions" ON public.user_subscriptions;

-- 2) subscribers: restrict writes to service role only (by removing client-side policies)
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- 3) payment_logs: ensure only the authenticated user can insert their own logs (edge functions bypass RLS)
DROP POLICY IF EXISTS "System can insert payment logs" ON public.payment_logs;
CREATE POLICY "Users can insert own payment logs"
ON public.payment_logs
FOR INSERT
WITH CHECK (user_id = auth.uid());
