-- Fix the last remaining Function Search Path warning
-- Check existing functions to find which one needs the search_path fix

-- Fix the check_package_limits function (the older version that might still exist)
CREATE OR REPLACE FUNCTION public.check_package_limits(p_user_id uuid, p_action_type text)
 RETURNS TABLE(can_perform_action boolean, current_count integer, max_allowed integer, package_name text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_subscription RECORD;
  v_current_count INTEGER := 0;
  v_max_allowed INTEGER := 0;
BEGIN
  -- Pobierz aktywną subskrypcję
  SELECT * INTO v_subscription 
  FROM get_user_active_subscription(p_user_id) 
  LIMIT 1;
  
  -- Jeśli brak aktywnej subskrypcji, ustaw domyślne limity trial
  IF v_subscription.subscription_id IS NULL THEN
    v_max_allowed := CASE 
      WHEN p_action_type = 'clients' THEN 5
      WHEN p_action_type = 'pets' THEN 10
      WHEN p_action_type = 'services' THEN 3
      WHEN p_action_type = 'specializations' THEN 2
      ELSE 0
    END;
    
    -- Policz obecne użycie
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
    
    RETURN QUERY SELECT 
      v_current_count < v_max_allowed as can_perform_action,
      v_current_count,
      v_max_allowed,
      'Trial'::TEXT as package_name;
    RETURN;
  END IF;
  
  -- Ustaw limity na podstawie pakietu
  v_max_allowed := CASE 
    WHEN p_action_type = 'clients' THEN v_subscription.max_clients
    WHEN p_action_type = 'pets' THEN v_subscription.max_pets
    WHEN p_action_type = 'services' THEN v_subscription.max_services
    WHEN p_action_type = 'specializations' THEN v_subscription.max_specializations
    ELSE 0
  END;
  
  -- Policz obecne użycie
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
  
  RETURN QUERY SELECT 
    v_current_count < v_max_allowed as can_perform_action,
    v_current_count,
    v_max_allowed,
    v_subscription.package_name;
END;
$function$;