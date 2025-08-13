-- Add RLS policy to allow Service Role to insert subscription records
-- This fixes the webhook blocking issue while maintaining security for regular users

CREATE POLICY "Service role can insert subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (
  -- Allow if using service role (auth.role() returns 'service_role')
  -- or if regular user is inserting their own subscription
  auth.role() = 'service_role' OR user_id = auth.uid()
);

-- Re-enable the audit trigger now that RLS is fixed
CREATE TRIGGER subscription_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.user_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.log_subscription_changes();