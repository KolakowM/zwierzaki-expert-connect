-- Hotfix: ensure active subscription row exists for demo@petsflow.pl
INSERT INTO public.user_subscriptions (user_id, package_id, status, start_date, end_date, payment_id)
SELECT s.user_id,
       '3d73a98e-9d72-47f6-b7c4-88167300b66c'::uuid AS package_id,
       'active'::text AS status,
       COALESCE((now() - interval '1 day')::timestamptz, now()) AS start_date,
       s.subscription_end,
       s.stripe_subscription_id AS payment_id
FROM public.subscribers s
WHERE s.email = 'demo@petsflow.pl'
ON CONFLICT (user_id)
DO UPDATE SET 
  package_id = EXCLUDED.package_id,
  status = 'active',
  end_date = EXCLUDED.end_date,
  payment_id = EXCLUDED.payment_id,
  updated_at = now();