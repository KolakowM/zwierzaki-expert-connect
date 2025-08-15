-- Fix subscription mechanism: ensure all users have trial subscriptions
-- and remove hardcoded limits

-- 1. Update handle_new_user function to create trial subscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  trial_package_id UUID;
BEGIN
  -- Get the trial package ID
  SELECT id INTO trial_package_id 
  FROM packages 
  WHERE name = 'Testowy' AND is_active = true
  LIMIT 1;
  
  -- Create user profile
  INSERT INTO public.user_profiles (id, first_name, last_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'firstName', new.raw_user_meta_data->>'lastName', new.email);
  
  -- Assign default role for new user
  INSERT INTO public.user_roles (user_id, role, status)
  VALUES (new.id, 'specialist'::app_role, 'niezweryfikowany');
  
  -- Create trial subscription for new user
  IF trial_package_id IS NOT NULL THEN
    INSERT INTO public.user_subscriptions (
      user_id, 
      package_id, 
      status, 
      start_date, 
      end_date
    ) VALUES (
      new.id,
      trial_package_id,
      'trial',
      now(),
      NULL -- Trial doesn't expire
    );
  END IF;
  
  RETURN new;
END;
$function$;

-- 2. Update get_user_effective_limits to always use package data (remove hardcoded values)
CREATE OR REPLACE FUNCTION public.get_user_effective_limits(p_user_id uuid)
RETURNS TABLE(max_clients integer, max_pets integer, max_services integer, max_specializations integer, can_access_carousel boolean, can_appear_in_catalog boolean)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
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
  
  -- If no active subscription, get trial package and create subscription
  IF v_subscription.subscription_id IS NULL THEN
    -- Get trial package
    SELECT id INTO trial_package_id 
    FROM packages 
    WHERE name = 'Testowy' AND is_active = true
    LIMIT 1;
    
    -- Create trial subscription if it doesn't exist
    IF trial_package_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM user_subscriptions 
      WHERE user_id = p_user_id AND package_id = trial_package_id
    ) THEN
      INSERT INTO user_subscriptions (user_id, package_id, status, start_date)
      VALUES (p_user_id, trial_package_id, 'trial', now());
    END IF;
    
    -- Get the subscription again
    SELECT * INTO v_subscription 
    FROM get_user_active_subscription(p_user_id) 
    LIMIT 1;
  END IF;
  
  -- If still no subscription, return minimal defaults as fallback
  IF v_subscription.subscription_id IS NULL THEN
    RETURN QUERY SELECT 
      1::INTEGER as max_clients,
      1::INTEGER as max_pets,
      1::INTEGER as max_services,
      1::INTEGER as max_specializations,
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

-- 3. Migrate existing users without subscriptions to have trial subscriptions
DO $migration$
DECLARE
  trial_package_id UUID;
  user_record RECORD;
BEGIN
  -- Get trial package ID
  SELECT id INTO trial_package_id 
  FROM packages 
  WHERE name = 'Testowy' AND is_active = true
  LIMIT 1;
  
  IF trial_package_id IS NOT NULL THEN
    -- Find users without any subscription and add trial subscription
    FOR user_record IN 
      SELECT up.id, up.email
      FROM user_profiles up
      WHERE NOT EXISTS (
        SELECT 1 FROM user_subscriptions us 
        WHERE us.user_id = up.id
      )
    LOOP
      INSERT INTO user_subscriptions (
        user_id, 
        package_id, 
        status, 
        start_date, 
        end_date
      ) VALUES (
        user_record.id,
        trial_package_id,
        'trial',
        now(),
        NULL
      );
      
      RAISE NOTICE 'Added trial subscription for user: %', user_record.email;
    END LOOP;
  END IF;
END;
$migration$;

-- 4. Update check_package_limits to always use package data
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
  -- Get effective limits (this will create trial subscription if needed)
  SELECT * INTO v_limits 
  FROM get_user_effective_limits(p_user_id) 
  LIMIT 1;
  
  -- Get package name from active subscription
  SELECT package_name INTO v_package_name
  FROM get_user_active_subscription(p_user_id)
  LIMIT 1;
  
  -- Set limits based on action type
  v_max_allowed := CASE 
    WHEN p_action_type = 'clients' THEN v_limits.max_clients
    WHEN p_action_type = 'pets' THEN v_limits.max_pets
    WHEN p_action_type = 'services' THEN v_limits.max_services
    WHEN p_action_type = 'specializations' THEN v_limits.max_specializations
    ELSE 0
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
      v_current_count, v_max_allowed, COALESCE(v_package_name, 'Trial')
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
    COALESCE(v_package_name, 'Trial')::TEXT as package_name,
    v_usage_percentage,
    v_is_at_soft_limit,
    v_error_message;
END;
$function$;