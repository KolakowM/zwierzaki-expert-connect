
import { supabase } from "@/integrations/supabase/client";
import { AppRole, UserData } from "./types";

export const getUsers = async (): Promise<UserData[]> => {
  try {
    // Get users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    // Get user profiles to get names
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name');
      
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
    
    // Create a map of user profiles
    const profileMap = userProfiles?.reduce((map, item) => {
      map[item.id] = {
        firstName: item.first_name,
        lastName: item.last_name
      };
      return map;
    }, {} as Record<string, {firstName?: string, lastName?: string}>) || {};
    
    // Map auth users to the format expected by the UI
    return authUsers.users.map(user => {
      const profile = profileMap[user.id] || {};
      const userMetadata = user.user_metadata as Record<string, any> || {};
      const name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 
                  (userMetadata && userMetadata.name) || 
                  'Użytkownik';
      
      // For the UI, we'll continue using 'specialist' for the frontend role
      // even though the database only stores 'user' or 'admin'
      const dbRole = roleMap[user.id] || (userMetadata?.role as string) || 'user';
      let uiRole = dbRole;
      
      // If user metadata indicates this is meant to be a specialist and db role is 'user',
      // we'll present it as 'specialist' to the UI
      if (dbRole === 'user' && userMetadata?.role === 'specialist') {
        uiRole = 'specialist';
      }
      
      return {
        id: user.id,
        name: name,
        email: user.email,
        role: uiRole as 'user' | 'admin' | 'specialist',
        status: userMetadata?.status || 'pending',
        lastLogin: user.last_sign_in_at
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
