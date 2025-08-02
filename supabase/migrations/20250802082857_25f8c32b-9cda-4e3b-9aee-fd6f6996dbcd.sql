
-- First, update the Zaawansowany package to allow catalog appearance
UPDATE packages 
SET can_appear_in_catalog = true
WHERE id = '4bd91835-0751-4790-9b5c-ca9c2f521314';

-- Update the get_catalog_specialists function to filter based on can_appear_in_catalog
CREATE OR REPLACE FUNCTION public.get_catalog_specialists(p_search_term text DEFAULT NULL::text, p_location text DEFAULT NULL::text, p_specializations uuid[] DEFAULT NULL::uuid[], p_page integer DEFAULT 1, p_page_size integer DEFAULT 9)
 RETURNS TABLE(id uuid, name text, title text, specializations uuid[], location text, image text, email text, rating integer, verified boolean, role app_role, is_featured boolean, total_count bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
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
$function$
