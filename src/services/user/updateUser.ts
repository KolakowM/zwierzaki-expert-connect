
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from "@/components/admin/users/UserFormDialog";
import { AppRole } from "./types";

export const updateUser = async (userId: string, userData: UserFormValues) => {
  try {
    // Update user metadata in Supabase Auth
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      email: userData.email, // Add ability to update email
      user_metadata: {
        name: userData.name,
        status: userData.status
      }
    });
    
    if (authError) throw authError;

    // Update user profile in user_profiles table
    const names = userData.name.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        email: userData.email,
        updated_at: new Date().toISOString()
      });
      
    if (profileError) throw profileError;
    
    // Update user role in user_roles table
    if (userData.role) {
      // First check if the role exists for this user
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (existingRole) {
        // Update existing role - don't convert 'specialist' to 'user'
        const dbRole = userData.role as AppRole;
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ 
            role: dbRole,
            status: userData.status
          })
          .eq('user_id', userId);
          
        if (roleError) throw roleError;
      } else {
        // Insert new role - don't convert 'specialist' to 'user'
        const dbRole = userData.role as AppRole;
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: dbRole,
            status: userData.status || 'niezweryfikowany'
          });
          
        if (roleError) throw roleError;
      }
    }
    
    // Return updated user
    return {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
    };
  } catch (error) {
    console.error('Błąd podczas aktualizacji użytkownika:', error);
    throw error;
  }
};
