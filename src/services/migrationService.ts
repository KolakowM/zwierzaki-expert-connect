
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "./authService";

/**
 * Sets the user_id for all existing clients that don't have a user_id
 * This is used for the initial migration after adding RLS
 */
export const migrateExistingClientsToCurrentUser = async (): Promise<void> => {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    console.log("No user logged in, skipping client migration");
    return;
  }
  
  try {
    // Update all clients with null user_id to current user
    const { error } = await supabase
      .from('clients')
      .update({ user_id: currentUser.id })
      .is('user_id', null);
    
    if (error) {
      console.error("Error migrating clients:", error);
      throw error;
    }
    
    console.log("Successfully migrated existing clients to current user");
  } catch (err) {
    console.error("Failed to migrate clients:", err);
    throw err;
  }
};
