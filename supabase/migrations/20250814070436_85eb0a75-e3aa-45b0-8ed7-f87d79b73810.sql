-- Clean up subscription mechanism - remove conflicts and duplicates

-- 1. Drop conflicting RLS policies (keep only the service role policy)
DROP POLICY IF EXISTS "Users can create own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.user_subscriptions;

-- 2. Remove duplicate unique constraints (keep only the main one)
DROP INDEX IF EXISTS public.ux_user_subscriptions_user_id;

-- 3. Ensure we have the correct service role policy (recreate to be sure)
DROP POLICY IF EXISTS "Service role can insert subscriptions" ON public.user_subscriptions;
CREATE POLICY "Service role can insert subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (
  auth.role() = 'service_role' OR user_id = auth.uid()
);

-- 4. Add UPDATE permission for service role (needed for webhook updates)
CREATE POLICY "Service role can update subscriptions" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.role() = 'service_role' OR user_id = auth.uid());

-- 5. Ensure audit trigger is properly set up
DROP TRIGGER IF EXISTS subscription_audit_trigger ON public.user_subscriptions;
CREATE TRIGGER subscription_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.user_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.log_subscription_changes();