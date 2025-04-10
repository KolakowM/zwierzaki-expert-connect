
-- Function to assign unassigned clients to a specific user
CREATE OR REPLACE FUNCTION public.assign_unassigned_clients_to_user(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the security of the function creator
AS $$
BEGIN
  -- Update all clients with null user_id
  UPDATE public.clients
  SET user_id = user_id_param
  WHERE user_id IS NULL;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.assign_unassigned_clients_to_user TO authenticated;
