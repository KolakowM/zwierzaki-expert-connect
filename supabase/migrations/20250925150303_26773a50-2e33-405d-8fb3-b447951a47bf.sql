-- Verify users with active paid subscriptions (Zaawansowany, Zawodowiec packages)
-- and update their status to 'zweryfikowany'

UPDATE user_roles 
SET status = 'zweryfikowany'
WHERE user_id IN (
  SELECT DISTINCT us.user_id
  FROM user_subscriptions us
  JOIN packages p ON us.package_id = p.id
  WHERE us.status = 'active'
    AND (us.end_date IS NULL OR us.end_date > now())
    AND p.name IN ('Zaawansowany', 'Zawodowiec')
    AND p.is_active = true
)
AND role = 'specialist'
AND status != 'zweryfikowany';

-- Log the verification for audit purposes
INSERT INTO subscription_audit (
  user_id, 
  action, 
  metadata
)
SELECT 
  ur.user_id,
  'manual_verification_paid_users',
  jsonb_build_object(
    'reason', 'Fixed webhook issue - verified users with active paid subscriptions',
    'timestamp', now(),
    'affected_packages', array['Zaawansowany', 'Zawodowiec']
  )
FROM user_roles ur
JOIN user_subscriptions us ON ur.user_id = us.user_id
JOIN packages p ON us.package_id = p.id
WHERE ur.role = 'specialist'
  AND ur.status = 'zweryfikowany'
  AND us.status = 'active'
  AND (us.end_date IS NULL OR us.end_date > now())
  AND p.name IN ('Zaawansowany', 'Zawodowiec')
  AND p.is_active = true;