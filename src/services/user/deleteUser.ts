
import { supabase } from "@/integrations/supabase/client";

export const deleteUser = async (userId: string) => {
  try {
    // Delete the user from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) throw error;
    
    // Return true to indicate success
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
