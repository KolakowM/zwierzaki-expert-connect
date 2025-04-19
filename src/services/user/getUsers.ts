
import { supabase } from "@/integrations/supabase/client";
import { AppRole, UserData } from "./types";

export const getUsers = async (): Promise<UserData[]> => {
  try {
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
    
    // Create a map of user roles
    const roleMap = userRoles?.reduce((map, item) => {
      map[item.user_id] = item.role;
      return map;
    }, {} as Record<string, AppRole>) || {};
    
    // Map user profiles to the format expected by the UI
    return (userProfiles || []).map(profile => {
      const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Użytkownik';
      const role = roleMap[profile.id] || 'user';
      
      return {
        id: profile.id,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Generate a placeholder email
        role: role === 'admin' ? 'admin' : 'user', // Simplify roles to just admin or user
        status: 'active', // Default status since we can't access metadata
        lastLogin: profile.updated_at // Use updated_at as proxy for last login
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
