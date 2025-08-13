-- Add INSERT policy for subscription_audit table to allow trigger functions
CREATE POLICY "Allow trigger functions to insert audit records" ON public.subscription_audit
FOR INSERT
WITH CHECK (true);