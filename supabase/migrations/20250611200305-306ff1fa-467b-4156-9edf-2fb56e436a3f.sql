
-- Fix the get_catalog_specialists function to avoid LIMIT variable issues
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
    featured_limit INTEGER;
    regular_limit INTEGER;
    remaining_slots INTEGER;
BEGIN
    -- Calculate offset for pagination
    offset_val := (p_page - 1) * p_page_size;
    
    -- Set fixed limits to avoid variable issues
    featured_limit := LEAST(3, p_page_size);
    
    -- Create temporary table for results
    CREATE TEMP TABLE IF NOT EXISTS temp_results (
        specialist_id UUID,
        specialist_name TEXT,
        specialist_title TEXT,
        specialist_specializations UUID[],
        specialist_location TEXT,
        specialist_image TEXT,
        specialist_email TEXT,
        is_featured_specialist BOOLEAN,
        total_rows BIGINT
    ) ON COMMIT DROP;
    
    -- Clear any existing data
    DELETE FROM temp_results;
    
    -- Insert filtered and featured specialists
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
    )
    INSERT INTO temp_results
    SELECT 
        fd.specialist_id,
        fd.specialist_name,
        fd.specialist_title,
        fd.specialist_specializations,
        fd.specialist_location,
        fd.specialist_image,
        fd.specialist_email,
        fd.is_featured_specialist,
        tc.total_rows
    FROM filtered_data fd
    CROSS JOIN total_count_calc tc;
    
    -- Get featured specialists first (up to 3 random)
    RETURN QUERY
    SELECT 
        tr.specialist_id,
        tr.specialist_name,
        tr.specialist_title,
        tr.specialist_specializations,
        tr.specialist_location,
        tr.specialist_image,
        tr.specialist_email,
        5 as rating,
        true as verified,
        'specialist'::app_role as role,
        tr.is_featured_specialist,
        tr.total_rows
    FROM temp_results tr
    WHERE tr.is_featured_specialist = true
    ORDER BY RANDOM()
    LIMIT 3;
    
    -- Calculate remaining slots
    GET DIAGNOSTICS remaining_slots = ROW_COUNT;
    regular_limit := p_page_size - remaining_slots;
    
    -- Get regular specialists to fill remaining slots
    IF regular_limit > 0 THEN
        RETURN QUERY
        SELECT 
            tr.specialist_id,
            tr.specialist_name,
            tr.specialist_title,
            tr.specialist_specializations,
            tr.specialist_location,
            tr.specialist_image,
            tr.specialist_email,
            5 as rating,
            true as verified,
            'specialist'::app_role as role,
            tr.is_featured_specialist,
            tr.total_rows
        FROM temp_results tr
        WHERE tr.is_featured_specialist = false
        ORDER BY tr.specialist_name
        LIMIT regular_limit
        OFFSET offset_val;
    END IF;
    
    RETURN;
END;
$$;
