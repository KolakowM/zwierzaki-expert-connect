
-- Simplify the get_catalog_specialists function to display specialists alphabetically
-- with featured badges, without prioritizing featured specialists at the top
DROP FUNCTION IF EXISTS public.get_catalog_specialists(text, text, uuid[], integer, integer);

CREATE OR REPLACE FUNCTION public.get_catalog_specialists(
    p_search_term TEXT DEFAULT NULL,
    p_location TEXT DEFAULT NULL,
    p_specializations UUID[] DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 9
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    title TEXT,
    specializations UUID[],
    location TEXT,
    image TEXT,
    email TEXT,
    rating INTEGER,
    verified BOOLEAN,
    role app_role,
    is_featured BOOLEAN,
    total_count BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
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
    featured_user_ids AS (
        SELECT DISTINCT us.user_id
        FROM user_subscriptions us
        WHERE us.package_id = '3d73a98e-9d72-47f6-b7c4-88167300b66c'
        AND us.status = 'active'
        AND (us.end_date IS NULL OR us.end_date > now())
    ),
    specialist_data AS (
        SELECT 
            vs.user_id as specialist_id,
            COALESCE(up.first_name || ' ' || up.last_name, 'Specjalista') as specialist_name,
            COALESCE(sp.title, 'Specjalista') as specialist_title,
            COALESCE(sp.location, up.city, 'Polska') as specialist_location,
            COALESCE(sp.photo_url, 'https://wrftbhmnqrdogomhvomr.supabase.co/storage/v1/object/public/profiles/profile-photos/ChatGPT%20Image%2031%20lip%202025,%2018_51_51.png') as specialist_image,
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
$$;
