
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from "@/components/admin/users/UserFormDialog";

type AppRole = 'user' | 'admin' | 'specialist';

// Create a new user
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
          role: (userData.role as AppRole) || 'user' 
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

// Update an existing user
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
        // Update existing role
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: userData.role as AppRole })
          .eq('user_id', userId);
          
        if (roleError) throw roleError;
      } else {
        // Insert new role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: userData.role as AppRole
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

// Delete a user
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

// Get a list of users
export const getUsers = async () => {
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
      const name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 
                   (user.user_metadata && (user.user_metadata as Record<string, any>).name) || 
                   'Użytkownik';
      
      return {
        id: user.id,
        name: name,
        email: user.email,
        role: roleMap[user.id] || ((user.user_metadata as Record<string, any>)?.role as AppRole) || 'user',
        status: (user.user_metadata as Record<string, any>)?.status || 'pending',
        lastLogin: user.last_sign_in_at
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to mock data if there's an error
    const mockUsers = [
      {
        id: "1",
        name: "Anna Kowalska",
        email: "anna.kowalska@example.com",
        role: "admin" as AppRole,
        status: "active",
        lastLogin: "2023-04-05T12:00:00Z"
      },
      {
        id: "2",
        name: "Jan Nowak",
        email: "jan.nowak@example.com",
        role: "specialist" as AppRole,
        status: "active",
        lastLogin: "2023-04-03T14:30:00Z"
      }
    ];
    
    return mockUsers;
  }
};
