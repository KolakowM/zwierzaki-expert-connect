
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from "@/components/admin/users/UserFormDialog";
import { AppRole } from "./types";

export const updateUser = async (userId: string, userData: UserFormValues) => {
  try {
    // Update the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        name: userData.name,
        status: userData.status
      }
    });
    
    if (authError) throw authError;
    
    // Update the user role in user_roles table
    if (userData.role) {
      // First check if the role exists for this user
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (existingRole) {
        // Update existing role - ensure we only use valid database roles (user or admin)
        const dbRole = userData.role === 'specialist' ? 'user' : userData.role as AppRole;
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: dbRole })
          .eq('user_id', userId);
          
        if (roleError) throw roleError;
      } else {
        // Insert new role - ensure we only use valid database roles (user or admin)
        const dbRole = userData.role === 'specialist' ? 'user' : userData.role as AppRole;
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: dbRole
          });
          
        if (roleError) throw roleError;
      }
    }
    
    // Return the updated user
    return {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
