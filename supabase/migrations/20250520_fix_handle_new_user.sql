
-- Fix the handle_new_user function to correctly access user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (id, first_name, last_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'firstName', new.raw_user_meta_data->>'lastName', new.email);
  
  -- Assign default role for new user
  INSERT INTO public.user_roles (user_id, role, status)
  VALUES (new.id, 'specialist'::app_role, 'niezweryfikowany');
  
  RETURN new;
END;
$$;
