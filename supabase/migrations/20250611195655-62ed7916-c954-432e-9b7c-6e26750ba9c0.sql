
-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_catalog_specialists(text, text, uuid[], integer, integer);

-- Create the updated function with featured specialists logic
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
    featured_specialists_count INTEGER;
    regular_specialists_count INTEGER;
BEGIN
    -- Calculate offset for pagination
    offset_val := (p_page - 1) * p_page_size;
    
    RETURN QUERY
    WITH verified_specialists AS (
        -- Get all verified specialists
        SELECT ur.user_id
        FROM user_roles ur
        WHERE ur.role = 'specialist'
        AND ur.status = 'zweryfikowany'
    ),
    featured_user_ids AS (
        -- Get users with active featured subscriptions
        SELECT DISTINCT us.user_id
        FROM user_subscriptions us
        WHERE us.package_id = '3d73a98e-9d72-47f6-b7c4-88167300b66c'
        AND us.status = 'active'
        AND (us.end_date IS NULL OR us.end_date > now())
    ),
    specialist_data AS (
        -- Get specialist data with all necessary information
        SELECT 
            vs.user_id as specialist_id,
            COALESCE(up.first_name || ' ' || up.last_name, 'Specjalista') as specialist_name,
            COALESCE(sp.title, 'Specjalista') as specialist_title,
            COALESCE(sp.location, up.city, 'Polska') as specialist_location,
            COALESCE(sp.photo_url, 'https://wrftbhmnqrdogomhvomr.supabase.co/storage/v1/object/public/profiles/profile-photos/ChatGPT%20Image%2031%20lip%202025,%2018_51_51.png') as specialist_image,
            COALESCE(sp.email, up.email) as specialist_email,
            CASE WHEN fui.user_id IS NOT NULL THEN true ELSE false END as is_featured_specialist,
            -- Get active specializations as array
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
        -- Apply filters
        SELECT sd.*
        FROM specialist_data sd
        WHERE 1=1
            -- Search term filter (name or title)
            AND (
                p_search_term IS NULL 
                OR p_search_term = ''
                OR LOWER(sd.specialist_name) LIKE LOWER('%' || p_search_term || '%')
                OR LOWER(sd.specialist_title) LIKE LOWER('%' || p_search_term || '%')
            )
            -- Location filter
            AND (
                p_location IS NULL 
                OR p_location = ''
                OR LOWER(sd.specialist_location) LIKE LOWER('%' || p_location || '%')
            )
            -- Specializations filter
            AND (
                p_specializations IS NULL 
                OR array_length(p_specializations, 1) IS NULL
                OR sd.specialist_specializations && p_specializations
            )
    ),
    total_count_calc AS (
        SELECT COUNT(*) as total_rows FROM filtered_data
    ),
    featured_specialists AS (
        -- Get random featured specialists for this page
        SELECT fd.*, tc.total_rows
        FROM filtered_data fd
        CROSS JOIN total_count_calc tc
        WHERE fd.is_featured_specialist = true
        ORDER BY RANDOM()
        LIMIT LEAST(3, p_page_size)
    ),
    remaining_slots AS (
        SELECT GREATEST(0, p_page_size - (SELECT COUNT(*) FROM featured_specialists)) as slots
    ),
    regular_specialists AS (
        -- Get regular specialists to fill remaining slots
        SELECT fd.*, tc.total_rows
        FROM filtered_data fd
        CROSS JOIN total_count_calc tc
        CROSS JOIN remaining_slots rs
        WHERE fd.is_featured_specialist = false
        ORDER BY fd.specialist_name
        LIMIT rs.slots
        OFFSET offset_val
    ),
    combined_results AS (
        -- Combine featured and regular specialists
        SELECT * FROM featured_specialists
        UNION ALL
        SELECT * FROM regular_specialists
    )
    SELECT 
        cr.specialist_id,
        cr.specialist_name,
        cr.specialist_title,
        cr.specialist_specializations,
        cr.specialist_location,
        cr.specialist_image,
        cr.specialist_email,
        5 as rating, -- Default rating
        true as verified, -- All these specialists are verified
        'specialist'::app_role as role,
        cr.is_featured_specialist,
        cr.total_rows
    FROM combined_results cr
    ORDER BY cr.is_featured_specialist DESC, cr.specialist_name;
END;
$$;
