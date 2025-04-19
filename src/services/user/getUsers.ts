
import { supabase } from "@/integrations/supabase/client";
import { AppRole, UserData } from "./types";

export const getUsers = async (): Promise<UserData[]> => {
  try {
    // Instead of using auth.admin.listUsers which requires admin privileges,
    // we'll get data from user_profiles and user_roles tables
    
    // Get user profiles from the database
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, updated_at');
      
    if (profilesError) throw profilesError;
    
    // Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
      
    if (rolesError) throw rolesError;
    
    // Get auth users for email (a separate query)
    const { data: authData, error: authError } = await supabase
      .from('auth.users')
      .select('id, email, last_sign_in_at')
      .eq('deleted_at', null);
    
    if (authError) {
      console.error('Cannot directly query auth.users table:', authError);
      // Continue without auth data, we'll use empty values
    }
    
    // Create a map of auth data (if we were able to get it)
    const authMap = authData?.reduce((map, item) => {
      map[item.id] = {
        email: item.email,
        lastLogin: item.last_sign_in_at
      };
      return map;
    }, {} as Record<string, {email?: string, lastLogin?: string}>) || {};
    
    // Create a map of user roles
    const roleMap = userRoles?.reduce((map, item) => {
      map[item.user_id] = item.role;
      return map;
    }, {} as Record<string, AppRole>) || {};
    
    // Map user profiles to the format expected by the UI
    return (userProfiles || []).map(profile => {
      const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Użytkownik';
      const dbRole = roleMap[profile.id] || 'user';
      
      // For the UI, we'll use 'specialist' for 'user' role with specific metadata
      // This is a simplification since we can't access user metadata
      let uiRole = dbRole;
      
      // Get auth data or use fallbacks
      const auth = authMap[profile.id] || {};
      
      return {
        id: profile.id,
        name: name,
        email: auth.email || 'email@example.com', // Fallback if we can't get the email
        role: uiRole as 'user' | 'admin' | 'specialist',
        status: 'active', // Default status since we can't access metadata
        lastLogin: auth.lastLogin
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
