-- Fix Function Search Path Mutable warnings by setting search_path for all functions
-- This is a critical security fix to prevent search path attacks

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$function$;

-- Fix initialize_missing_specialist_profiles function
CREATE OR REPLACE FUNCTION public.initialize_missing_specialist_profiles()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    -- Znajdź wszystkich użytkowników z rolą specialist, którzy nie mają profilu
    INSERT INTO specialist_profiles (
        id, title, description, location, updated_at, services, education
    )
    SELECT 
        ur.user_id, 
        'Specjalista', 
        'Opis profilu specjalisty...', 
        'Polska',
        now(),
        ARRAY[]::text[],
        ARRAY[]::text[]
    FROM 
        user_roles ur
    WHERE 
        ur.role = 'specialist'
        AND NOT EXISTS (
            SELECT 1 
            FROM specialist_profiles sp 
            WHERE sp.id = ur.user_id
        );
END;
$function$;

-- Fix get_user_effective_limits function
CREATE OR REPLACE FUNCTION public.get_user_effective_limits(p_user_id uuid)
 RETURNS TABLE(max_clients integer, max_pets integer, max_services integer, max_specializations integer, can_access_carousel boolean, can_appear_in_catalog boolean)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_subscription RECORD;
  v_client_addons INTEGER := 0;
  v_pet_addons INTEGER := 0;
BEGIN
  -- Get base limits from active subscription
  SELECT * INTO v_subscription 
  FROM get_user_active_subscription(p_user_id) 
  LIMIT 1;
  
  -- If no active subscription, use trial limits
  IF v_subscription.subscription_id IS NULL THEN
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
      (5 + v_client_addons)::INTEGER as max_clients,
      (10 + v_pet_addons)::INTEGER as max_pets,
      3::INTEGER as max_services,
      2::INTEGER as max_specializations,
      false as can_access_carousel,
      true as can_appear_in_catalog;
    RETURN;
  END IF;
  
  -- Calculate addon bonuses for active subscription
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

-- Fix check_package_limits function (latest version)
CREATE OR REPLACE FUNCTION public.check_package_limits(p_user_id uuid, p_action_type text, p_soft_check boolean DEFAULT true)
 RETURNS TABLE(can_perform_action boolean, current_count integer, max_allowed integer, package_name text, usage_percentage integer, is_at_soft_limit boolean, error_message text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$DECLARE
  v_subscription RECORD;
  v_current_count INTEGER := 0;
  v_max_allowed INTEGER := 0;
  v_usage_percentage INTEGER := 0;
  v_is_at_soft_limit BOOLEAN := false;
  v_error_message TEXT := null;
BEGIN
  -- Get active subscription
  SELECT * INTO v_subscription 
  FROM get_user_active_subscription(p_user_id) 
  LIMIT 1;
  
  -- If no active subscription, use trial limits
  IF v_subscription.subscription_id IS NULL THEN
    v_max_allowed := CASE 
      WHEN p_action_type = 'clients' THEN 5
      WHEN p_action_type = 'pets' THEN 10
      WHEN p_action_type = 'services' THEN 3
      WHEN p_action_type = 'specializations' THEN 1
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
      v_error_message := format('Osiągnięto limit %s (%s/%s) w pakiecie Trial. Ulepsz pakiet, aby dodać więcej.', 
        CASE 
          WHEN p_action_type = 'clients' THEN 'klientów'
          WHEN p_action_type = 'pets' THEN 'zwierząt'
          WHEN p_action_type = 'services' THEN 'usług'
          WHEN p_action_type = 'specializations' THEN 'specjalizacji'
          ELSE 'elementów'
        END,
        v_current_count, v_max_allowed
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
      'Trial'::TEXT as package_name,
      v_usage_percentage,
      v_is_at_soft_limit,
      v_error_message;
    RETURN;
  END IF;
  
  -- Set limits based on package
  v_max_allowed := CASE 
    WHEN p_action_type = 'clients' THEN v_subscription.max_clients
    WHEN p_action_type = 'pets' THEN v_subscription.max_pets
    WHEN p_action_type = 'services' THEN v_subscription.max_services
    WHEN p_action_type = 'specializations' THEN v_subscription.max_specializations
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
      v_current_count, v_max_allowed, v_subscription.package_name
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
    v_subscription.package_name,
    v_usage_percentage,
    v_is_at_soft_limit,
    v_error_message;
END;$function$;

-- Fix assign_unassigned_clients_to_user function
CREATE OR REPLACE FUNCTION public.assign_unassigned_clients_to_user(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Update all clients with null user_id
  UPDATE public.clients
  SET user_id = user_id_param
  WHERE user_id IS NULL;
END;
$function$;

-- Fix get_catalog_specialists function
CREATE OR REPLACE FUNCTION public.get_catalog_specialists(p_search_term text DEFAULT NULL::text, p_location text DEFAULT NULL::text, p_specializations uuid[] DEFAULT NULL::uuid[], p_page integer DEFAULT 1, p_page_size integer DEFAULT 9)
 RETURNS TABLE(id uuid, name text, title text, specializations uuid[], location text, image text, email text, rating integer, verified boolean, role app_role, is_featured boolean, total_count bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
    offset_val INTEGER;
BEGIN
    -- Calculate offset for pagination
    offset_val := (p_page - 1) * p_page_size;
    
    RETURN QUERY
    WITH verified_specialists AS (
        SELECT ur.user_id
        FROM user_roles ur
        WHERE ur.role = 'specialist'
        AND ur.status = 'zweryfikowany'
    ),
    catalog_eligible_users AS (
        -- Get users with active subscriptions that allow catalog appearance
        SELECT DISTINCT us.user_id
        FROM user_subscriptions us
        JOIN packages p ON us.package_id = p.id
        WHERE us.status = 'active'
        AND (us.end_date IS NULL OR us.end_date > now())
        AND p.can_appear_in_catalog = true
    ),
    featured_user_ids AS (
        -- Featured users are those with Zawodowiec package (can_access_carousel = true)
        SELECT DISTINCT us.user_id
        FROM user_subscriptions us
        JOIN packages p ON us.package_id = p.id
        WHERE us.status = 'active'
        AND (us.end_date IS NULL OR us.end_date > now())
        AND p.can_access_carousel = true
    ),
    specialist_data AS (
        SELECT 
            vs.user_id as specialist_id,
            COALESCE(up.first_name || ' ' || up.last_name, 'Specjalista') as specialist_name,
            COALESCE(sp.title, 'Specjalista') as specialist_title,
            COALESCE(sp.location, up.city, 'Polska') as specialist_location,
            sp.photo_url as specialist_image,
            COALESCE(sp.email, up.email) as specialist_email,
            CASE WHEN fui.user_id IS NOT NULL THEN true ELSE false END as is_featured_specialist,
            COALESCE(
                ARRAY(
                    SELECT ss.specialization_id 
                    FROM specialist_specializations ss 
                    WHERE ss.specialist_id = vs.user_id 
                    AND ss.active = 'yes'
                ), 
                ARRAY[]::UUID[]
            ) as specialist_specializations
        FROM verified_specialists vs
        INNER JOIN catalog_eligible_users ceu ON vs.user_id = ceu.user_id
        LEFT JOIN user_profiles up ON vs.user_id = up.id
        LEFT JOIN specialist_profiles sp ON vs.user_id = sp.id
        LEFT JOIN featured_user_ids fui ON vs.user_id = fui.user_id
    ),
    filtered_data AS (
        SELECT sd.*
        FROM specialist_data sd
        WHERE 1=1
            AND (
                p_search_term IS NULL 
                OR p_search_term = ''
                OR LOWER(sd.specialist_name) LIKE LOWER('%' || p_search_term || '%')
                OR LOWER(sd.specialist_title) LIKE LOWER('%' || p_search_term || '%')
            )
            AND (
                p_location IS NULL 
                OR p_location = ''
                OR LOWER(sd.specialist_location) LIKE LOWER('%' || p_location || '%')
            )
            AND (
                p_specializations IS NULL 
                OR array_length(p_specializations, 1) IS NULL
                OR sd.specialist_specializations && p_specializations
            )
    ),
    total_count_calc AS (
        SELECT COUNT(*) as total_rows FROM filtered_data
    ),
    paginated_results AS (
        SELECT fd.*, tc.total_rows
        FROM filtered_data fd
        CROSS JOIN total_count_calc tc
        ORDER BY fd.specialist_name
        LIMIT p_page_size
        OFFSET offset_val
    )
    SELECT 
        pr.specialist_id,
        pr.specialist_name,
        pr.specialist_title,
        pr.specialist_specializations,
        pr.specialist_location,
        pr.specialist_image,
        pr.specialist_email,
        5 as rating,
        true as verified,
        'specialist'::app_role as role,
        pr.is_featured_specialist,
        pr.total_rows
    FROM paginated_results pr
    ORDER BY pr.specialist_name;
END;
$function$;

-- Fix get_user_active_subscription function
CREATE OR REPLACE FUNCTION public.get_user_active_subscription(p_user_id uuid)
 RETURNS TABLE(subscription_id uuid, package_id uuid, package_name text, status text, max_clients integer, max_pets integer, max_services integer, max_specializations integer, can_access_carousel boolean, can_appear_in_catalog boolean, end_date timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT 
    us.id as subscription_id,
    p.id as package_id,
    p.name as package_name,
    us.status,
    p.max_clients,
    p.max_pets,
    p.max_services,
    p.max_specializations,
    p.can_access_carousel,
    p.can_appear_in_catalog,
    us.end_date
  FROM user_subscriptions us
  JOIN packages p ON us.package_id = p.id
  WHERE us.user_id = p_user_id 
    AND us.status = 'active'
    AND (us.end_date IS NULL OR us.end_date > now())
  ORDER BY us.created_at DESC
  LIMIT 1;
$function$;