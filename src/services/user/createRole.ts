
import { supabase } from "@/integrations/supabase/client";
import { AppRole, UserRoleData } from "./types";

export const createUserRole = async (userId: string, role: AppRole = 'user', status: string = 'niezweryfikowany'): Promise<UserRoleData | null> => {
  try {
    // Check if role already exists for this user
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (existingRole) {
      console.log('Role already exists for this user', existingRole);
      return existingRole as UserRoleData;
    }
    
    // Create new role for the user
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role,
        status: status
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
    
    console.log('Created user role:', data);
    return data as UserRoleData;
  } catch (error) {
    console.error('Error creating user role:', error);
    return null;
  }
};
