
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
        name: userData.name,
        role: userData.role,
        status: userData.status
      }
    });
    
    if (authError) throw authError;
    
    // If user creation was successful, store the user role in user_roles table
    if (authData.user) {
      // Insert into user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: (userData.role === 'specialist' ? 'user' : userData.role) as AppRole
        });
        
      if (roleError) throw roleError;
      
      // Return the new user
      return {
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        status: userData.status || 'pending',
        lastLogin: null
      };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
