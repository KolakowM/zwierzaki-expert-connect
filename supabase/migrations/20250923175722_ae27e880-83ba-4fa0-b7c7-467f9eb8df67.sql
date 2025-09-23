-- Fix subscription limits issue for users with expired/cancelled subscriptions

-- 1. Get the Trial package ID
DO $$
DECLARE
    trial_package_id UUID;
    demo_user_id UUID := 'ba36d7c0-25cd-498e-8d53-3f4e5e704b94';
BEGIN
    -- Get Trial package ID
    SELECT id INTO trial_package_id 
    FROM packages 
    WHERE name = 'Testowy' AND is_active = true
    LIMIT 1;
    
    -- Fix demo@petsflow.pl user's subscription
    UPDATE user_subscriptions
    SET 
        package_id = trial_package_id,
        status = 'trial',
        end_date = NULL,
        updated_at = now()
    WHERE user_id = demo_user_id;
    
    -- If no subscription exists for demo user, create one
    IF NOT FOUND THEN
        INSERT INTO user_subscriptions (user_id, package_id, status, start_date, end_date)
        VALUES (demo_user_id, trial_package_id, 'trial', now(), NULL)
        ON CONFLICT (user_id) DO UPDATE SET
            package_id = trial_package_id,
            status = 'trial',
            end_date = NULL,
            updated_at = now();
    END IF;
    
    -- Migrate all users with expired or cancelled subscriptions to Trial
    UPDATE user_subscriptions
    SET 
        package_id = trial_package_id,
        status = 'trial',
        end_date = NULL,
        updated_at = now()
    WHERE status IN ('expired', 'cancelled') 
       OR (status = 'active' AND end_date IS NOT NULL AND end_date <= now());
    
    RAISE NOTICE 'Fixed subscriptions for users with expired/cancelled subscriptions';
END $$;

-- 2. Update get_user_effective_limits function to handle expired subscriptions properly
CREATE OR REPLACE FUNCTION public.get_user_effective_limits(p_user_id uuid)
 RETURNS TABLE(max_clients integer, max_pets integer, max_services integer, max_specializations integer, can_access_carousel boolean, can_appear_in_catalog boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_subscription RECORD;
  v_client_addons INTEGER := 0;
  v_pet_addons INTEGER := 0;
  trial_package_id UUID;
BEGIN
  -- Get active subscription
  SELECT * INTO v_subscription 
  FROM get_user_active_subscription(p_user_id) 
  LIMIT 1;
  
  -- If no active subscription, handle expired/cancelled subscriptions
  IF v_subscription.subscription_id IS NULL THEN
    -- Get trial package
    SELECT id INTO trial_package_id 
    FROM packages 
    WHERE name = 'Testowy' AND is_active = true
    LIMIT 1;
    
    -- Check if user has any subscription that needs to be updated to trial
    IF EXISTS (
      SELECT 1 FROM user_subscriptions 
      WHERE user_id = p_user_id 
        AND (status IN ('expired', 'cancelled') OR (status = 'active' AND end_date IS NOT NULL AND end_date <= now()))
    ) THEN
      -- Update existing subscription to trial
      UPDATE user_subscriptions
      SET 
        package_id = trial_package_id,
        status = 'trial',
        end_date = NULL,
        updated_at = now()
      WHERE user_id = p_user_id
        AND id = (
          SELECT id FROM user_subscriptions 
          WHERE user_id = p_user_id 
          ORDER BY created_at DESC 
          LIMIT 1
        );
    ELSIF NOT EXISTS (SELECT 1 FROM user_subscriptions WHERE user_id = p_user_id) THEN
      -- Create new trial subscription only if no subscription exists at all
      INSERT INTO user_subscriptions (user_id, package_id, status, start_date)
      VALUES (p_user_id, trial_package_id, 'trial', now());
    END IF;
    
    -- Get the subscription again
    SELECT * INTO v_subscription 
    FROM get_user_active_subscription(p_user_id) 
    LIMIT 1;
  END IF;
  
  -- If still no subscription, return trial defaults as fallback
  IF v_subscription.subscription_id IS NULL THEN
    RETURN QUERY SELECT 
      5::INTEGER as max_clients,
      10::INTEGER as max_pets,
      3::INTEGER as max_services,
      3::INTEGER as max_specializations,
      false as can_access_carousel,
      true as can_appear_in_catalog;
    RETURN;
  END IF;
  
  -- Calculate addon bonuses
  SELECT COALESCE(SUM(ua.quantity * a.limit_increase), 0) INTO v_client_addons
  FROM user_addons ua
  JOIN addons a ON ua.addon_id = a.id
  WHERE ua.user_id = p_user_id 
    AND ua.status = 'active'
    AND a.addon_type = 'clients';
    
  SELECT COALESCE(SUM(ua.quantity * a.limit_increase), 0) INTO v_pet_addons
  FROM user_addons ua
  JOIN addons a ON ua.addon_id = a.id
  WHERE ua.user_id = p_user_id 
    AND ua.status = 'active'
    AND a.addon_type = 'pets';
  
  RETURN QUERY SELECT 
    (v_subscription.max_clients + v_client_addons)::INTEGER as max_clients,
    (v_subscription.max_pets + v_pet_addons)::INTEGER as max_pets,
    v_subscription.max_services,
    v_subscription.max_specializations,
    v_subscription.can_access_carousel,
    v_subscription.can_appear_in_catalog;
END;
$function$;

-- 3. Update check_package_limits function to provide better fallbacks
CREATE OR REPLACE FUNCTION public.check_package_limits(p_user_id uuid, p_action_type text, p_soft_check boolean DEFAULT true)
 RETURNS TABLE(can_perform_action boolean, current_count integer, max_allowed integer, package_name text, usage_percentage integer, is_at_soft_limit boolean, error_message text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_limits RECORD;
  v_current_count INTEGER := 0;
  v_max_allowed INTEGER := 0;
  v_usage_percentage INTEGER := 0;
  v_is_at_soft_limit BOOLEAN := false;
  v_error_message TEXT := null;
  v_package_name TEXT := 'Trial';
BEGIN
  -- Get effective limits (this will handle expired subscriptions)
  SELECT * INTO v_limits 
  FROM get_user_effective_limits(p_user_id) 
  LIMIT 1;
  
  -- Get package name from active subscription, fallback to Trial
  SELECT COALESCE(sub.package_name, 'Trial') INTO v_package_name
  FROM get_user_active_subscription(p_user_id) sub
  LIMIT 1;
  
  -- Set limits based on action type with fallbacks
  v_max_allowed := CASE 
    WHEN p_action_type = 'clients' THEN COALESCE(v_limits.max_clients, 5)
    WHEN p_action_type = 'pets' THEN COALESCE(v_limits.max_pets, 10)
    WHEN p_action_type = 'services' THEN COALESCE(v_limits.max_services, 3)
    WHEN p_action_type = 'specializations' THEN COALESCE(v_limits.max_specializations, 3)
    ELSE 1
  END;
  
  -- Count current usage
  v_current_count := CASE 
    WHEN p_action_type = 'clients' THEN 
      (SELECT COUNT(*) FROM clients WHERE user_id = p_user_id)
    WHEN p_action_type = 'pets' THEN 
      (SELECT COUNT(*) FROM pets p JOIN clients c ON p.clientid = c.id WHERE c.user_id = p_user_id)
    WHEN p_action_type = 'services' THEN 
      (SELECT COALESCE(array_length(services, 1), 0) FROM specialist_profiles WHERE id = p_user_id)
    WHEN p_action_type = 'specializations' THEN 
      (SELECT COUNT(*) FROM specialist_specializations WHERE specialist_id = p_user_id AND active = 'yes')
    ELSE 0
  END;
  
  -- Calculate usage percentage
  v_usage_percentage := CASE 
    WHEN v_max_allowed > 0 THEN ROUND((v_current_count::numeric / v_max_allowed::numeric) * 100)
    ELSE 0
  END;
  
  -- Check soft limit (80%)
  v_is_at_soft_limit := v_usage_percentage >= 80;
  
  -- Generate error message if at limit
  IF v_current_count >= v_max_allowed THEN
    v_error_message := format('Osiągnięto limit %s (%s/%s) w pakiecie %s. Ulepsz pakiet, aby dodać więcej.', 
      CASE 
        WHEN p_action_type = 'clients' THEN 'klientów'
        WHEN p_action_type = 'pets' THEN 'zwierząt'
        WHEN p_action_type = 'services' THEN 'usług'
        WHEN p_action_type = 'specializations' THEN 'specjalizacji'
        ELSE 'elementów'
      END,
      v_current_count, v_max_allowed, v_package_name
    );
  END IF;
  
  -- For hard checks, throw exception if limit exceeded
  IF NOT p_soft_check AND v_current_count >= v_max_allowed THEN
    RAISE EXCEPTION 'PACKAGE_LIMIT_EXCEEDED: %', v_error_message;
  END IF;
  
  RETURN QUERY SELECT 
    v_current_count < v_max_allowed as can_perform_action,
    v_current_count,
    v_max_allowed,
    v_package_name::TEXT as package_name,
    v_usage_percentage,
    v_is_at_soft_limit,
    v_error_message;
END;
$function$;

-- 4. Make sure Trial package allows catalog visibility
UPDATE packages 
SET can_appear_in_catalog = true 
WHERE name = 'Testowy' AND is_active = true;