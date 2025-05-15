
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from "@/components/admin/users/UserFormDialog";
import { AppRole } from "./types";

export const createUser = async (userData: UserFormValues) => {
  try {
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: '123456', // Temporary password, should be changed by the user
      email_confirm: true,
      user_metadata: {
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ').slice(1).join(' '),
        role: userData.role,
        status: userData.status
      }
    });
    
    if (authError) throw authError;
    
    // The handle_new_user trigger will automatically create user_profile and user_role
    // We just need to return the new user data in the expected format
    if (authData.user) {
      return {
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        status: 'niezweryfikowany',
        lastLogin: null
      };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
