
-- Create improved catalog filtering RPC function
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
        -- Get all verified specialists
        SELECT ur.user_id
        FROM user_roles ur
        WHERE ur.role = 'specialist'
        AND ur.status = 'zweryfikowany'
    ),
    specialist_data AS (
        -- Get specialist data with all necessary information
        SELECT 
            vs.user_id as specialist_id,
            COALESCE(up.first_name || ' ' || up.last_name, 'Specjalista') as specialist_name,
            COALESCE(sp.title, 'Specjalista') as specialist_title,
            COALESCE(sp.location, up.city, 'Polska') as specialist_location,
            COALESCE(sp.photo_url, 'https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop') as specialist_image,
            COALESCE(sp.email, up.email) as specialist_email,
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
    paginated_data AS (
        SELECT fd.*, tc.total_rows
        FROM filtered_data fd
        CROSS JOIN total_count_calc tc
        ORDER BY fd.specialist_name
        LIMIT p_page_size
        OFFSET offset_val
    )
    SELECT 
        pd.specialist_id,
        pd.specialist_name,
        pd.specialist_title,
        pd.specialist_specializations,
        pd.specialist_location,
        pd.specialist_image,
        pd.specialist_email,
        5 as rating, -- Default rating
        true as verified, -- All these specialists are verified
        'specialist'::app_role as role,
        pd.total_rows
    FROM paginated_data pd;
END;
$$;
