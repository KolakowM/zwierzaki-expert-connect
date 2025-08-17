-- Add public read access policy for user_subscriptions to enable carousel for non-authenticated users
CREATE POLICY "Public can view active subscriptions for carousel" 
ON public.user_subscriptions 
FOR SELECT 
TO public
USING (status = 'active');