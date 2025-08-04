-- Fix remaining Function Search Path Mutable warnings

-- Fix get_catalog_data function
CREATE OR REPLACE FUNCTION public.get_catalog_data(p_search_term text DEFAULT NULL::text, p_location text DEFAULT NULL::text, p_specializations uuid[] DEFAULT NULL::uuid[], p_roles app_role[] DEFAULT NULL::app_role[], p_page integer DEFAULT 1, p_page_size integer DEFAULT 9)
 RETURNS TABLE(id uuid, name text, title text, specializations uuid[], location text, image text, email text, rating integer, verified boolean, role app_role, total_count bigint)
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
  WITH filtered_users AS (
    SELECT 
      up.id,
      COALESCE(up.first_name || ' ' || up.last_name, 'Użytkownik') as user_name,
      COALESCE(sp.title, 
        CASE 
          WHEN ur.role = 'admin' THEN 'Administrator'
          ELSE 'Użytkownik systemu'
        END
      ) as user_title,
      COALESCE(sp.location, up.city, 'Polska') as user_location,
      COALESCE(sp.photo_url, '/placeholder.svg') as user_image,
      COALESCE(sp.email, up.email) as user_email,
      CASE WHEN ur.status = 'zweryfikowany' THEN true ELSE false END as is_verified,
      COALESCE(ur.role, 'user'::app_role) as user_role,
      -- Get active specializations as array
      COALESCE(
        ARRAY(
          SELECT ss.specialization_id 
          FROM specialist_specializations ss 
          WHERE ss.specialist_id = up.id 
          AND ss.active = 'yes'
        ), 
        ARRAY[]::UUID[]
      ) as user_specializations
    FROM user_profiles up
    LEFT JOIN user_roles ur ON up.id = ur.user_id
    LEFT JOIN specialist_profiles sp ON up.id = sp.id
    WHERE 1=1
      -- Search term filter
      AND (
        p_search_term IS NULL 
        OR LOWER(COALESCE(up.first_name || ' ' || up.last_name, 'Użytkownik')) LIKE LOWER('%' || p_search_term || '%')
        OR LOWER(COALESCE(sp.title, 'Użytkownik systemu')) LIKE LOWER('%' || p_search_term || '%')
      )
      -- Location filter
      AND (
        p_location IS NULL 
        OR LOWER(COALESCE(sp.location, up.city, 'Polska')) LIKE LOWER('%' || p_location || '%')
      )
      -- Role filter
      AND (
        p_roles IS NULL 
        OR COALESCE(ur.role, 'user'::app_role) = ANY(p_roles)
      )
  ),
  specialization_filtered AS (
    SELECT fu.*
    FROM filtered_users fu
    WHERE 
      p_specializations IS NULL 
      OR fu.user_specializations && p_specializations
  ),
  total_count_calc AS (
    SELECT COUNT(*) as total_rows FROM specialization_filtered
  )
  SELECT 
    sf.id,
    sf.user_name,
    sf.user_title,
    sf.user_specializations,
    sf.user_location,
    sf.user_image,
    sf.user_email,
    0 as rating, -- Placeholder for future rating system
    sf.is_verified,
    sf.user_role,
    tc.total_rows
  FROM specialization_filtered sf
  CROSS JOIN total_count_calc tc
  ORDER BY sf.user_name
  LIMIT p_page_size
  OFFSET offset_val;
END;
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (id, first_name, last_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'firstName', new.raw_user_meta_data->>'lastName', new.email);
  
  -- Assign default role for new user
  INSERT INTO public.user_roles (user_id, role, status)
  VALUES (new.id, 'specialist'::app_role, 'niezweryfikowany');
  
  RETURN new;
END;
$function$;

-- Fix initialize_specialist_specializations function
CREATE OR REPLACE FUNCTION public.initialize_specialist_specializations()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$DECLARE
    specialist_id_var UUID;
BEGIN
    -- Dla każdego istniejącego specjalisty
    FOR specialist_id_var IN SELECT id FROM specialist_profiles
    LOOP
        -- Zachowaj informacje o istniejących specjalizacjach
        WITH existing_specs AS (
            SELECT specialization_id FROM specialist_specializations 
            WHERE specialist_id = specialist_id_var
        )
        -- Wstaw wszystkie brakujące specjalizacje z active = 'no'
        INSERT INTO specialist_specializations (specialist_id, specialization_id, active)
        SELECT 
            specialist_id_var, 
            s.id, 
            'no'::specialist_specializations_inactive
        FROM 
            specializations s
        WHERE 
            NOT EXISTS (
                SELECT 1 FROM specialist_specializations 
                WHERE specialist_id = specialist_id_var AND specialization_id = s.id
            );
            
        -- Ustaw active = 'no' dla istniejących specjalizacji
        UPDATE specialist_specializations
        SET active = 'no'::specialist_specializations_inactive
        WHERE specialist_id = specialist_id_var
        AND EXISTS (
            SELECT 1 FROM specialist_specializations ss
            WHERE ss.specialist_id = specialist_id_var
            AND ss.specialization_id = specialization_id
        );
    END LOOP;
END;$function$;

-- Fix handle_specialist_profile function
CREATE OR REPLACE FUNCTION public.handle_specialist_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    -- Sprawdź, czy użytkownik ma rolę specialist - teraz używamy NEW.user_id
    IF EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = NEW.user_id AND role = 'specialist'
    ) OR NEW.role = 'specialist' THEN
        -- Sprawdź czy nie istnieje już profil dla tego użytkownika
        IF NOT EXISTS (SELECT 1 FROM specialist_profiles WHERE id = NEW.user_id) THEN
            -- Utwórz nowy profil specjalisty z podstawowymi danymi
            INSERT INTO specialist_profiles (
                id, 
                title, 
                description, 
                location, 
                updated_at,
                services,
                education
            ) VALUES (
                NEW.user_id, 
                'Specjalista', 
                'Opis profilu specjalisty...', 
                'Polska',
                now(),
                ARRAY[]::text[],
                ARRAY[]::text[]
            );
            
            -- Dodaj wszystkie dostępne specjalizacje dla nowego użytkownika z active = 'no'
            INSERT INTO specialist_specializations (specialist_id, specialization_id, active)
            SELECT NEW.user_id, id, 'no'::specialist_specializations_inactive
            FROM specializations;
            
            -- Log do audytu
            RAISE NOTICE 'Created specialist profile and specializations for user %', NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$function$;

-- Fix auto_expire_subscriptions function
CREATE OR REPLACE FUNCTION public.auto_expire_subscriptions()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Aktualizuj wygasłe subskrypcje
  UPDATE user_subscriptions 
  SET status = 'expired', updated_at = now()
  WHERE status = 'active' 
    AND end_date IS NOT NULL 
    AND end_date <= now();
    
  RETURN NULL;
END;
$function$;

-- Fix trigger_expire_subscriptions function
CREATE OR REPLACE FUNCTION public.trigger_expire_subscriptions()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  PERFORM auto_expire_subscriptions();
  RETURN NEW;
END;
$function$;

-- Fix log_subscription_changes function
CREATE OR REPLACE FUNCTION public.log_subscription_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  action_type TEXT;
  old_pkg_id UUID;
  new_pkg_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
    new_pkg_id := NEW.package_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      action_type := CASE 
        WHEN NEW.status = 'active' THEN 'activated'
        WHEN NEW.status = 'expired' THEN 'expired'
        WHEN NEW.status = 'cancelled' THEN 'cancelled'
        ELSE 'status_changed'
      END;
    ELSIF OLD.package_id != NEW.package_id THEN
      action_type := 'package_changed';
      old_pkg_id := OLD.package_id;
      new_pkg_id := NEW.package_id;
    ELSE
      action_type := 'updated';
    END IF;
    old_pkg_id := COALESCE(old_pkg_id, OLD.package_id);
    new_pkg_id := COALESCE(new_pkg_id, NEW.package_id);
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'deleted';
    old_pkg_id := OLD.package_id;
  END IF;

  INSERT INTO subscription_audit (
    subscription_id,
    user_id,
    action,
    old_package_id,
    new_package_id,
    metadata
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    COALESCE(NEW.user_id, OLD.user_id),
    action_type,
    old_pkg_id,
    new_pkg_id,
    jsonb_build_object(
      'trigger_op', TG_OP,
      'timestamp', now()
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix get_user_usage_stats function
CREATE OR REPLACE FUNCTION public.get_user_usage_stats(p_user_id uuid)
 RETURNS TABLE(clients_count integer, pets_count integer, services_count integer, specializations_count integer, active_visits_count integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM clients WHERE user_id = p_user_id) as clients_count,
    (SELECT COUNT(*)::INTEGER FROM pets p JOIN clients c ON p.clientid = c.id WHERE c.user_id = p_user_id) as pets_count,
    (SELECT COALESCE(array_length(services, 1), 0)::INTEGER FROM specialist_profiles WHERE id = p_user_id) as services_count,
    (SELECT COUNT(*)::INTEGER FROM specialist_specializations WHERE specialist_id = p_user_id AND active = 'yes') as specializations_count,
    (SELECT COUNT(*)::INTEGER FROM visits v JOIN clients c ON v.clientid = c.id WHERE c.user_id = p_user_id AND v.status = 'planowana') as active_visits_count;
$function$;