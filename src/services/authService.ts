
import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  firstName?: string;
  lastName?: string;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
}

// Enhanced caching mechanism with better validation and error handling
let cachedUser: AuthUser | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 20000; // Reduced to 20 seconds for better responsiveness
let pendingUserFetch: Promise<AuthUser | null> | null = null;

export const signIn = async ({ email, password }: SignInCredentials) => {
  // Clear cache BEFORE signing in to ensure fresh data
  clearUserCache();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data.user;
};

export const signUp = async ({ email, password, firstName, lastName }: SignUpCredentials) => {
  try {
    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          // The role will be assigned by the handle_new_user trigger function
        },
      },
    });

    if (error) {
      throw error;
    }

    return data.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  
  // Clear cache on logout
  clearUserCache();
  
  // Clear any local session data to ensure complete logout
  localStorage.removeItem('supabase.auth.token');
};

// Helper function to clear user cache
const clearUserCache = () => {
  cachedUser = null;
  cacheTimestamp = 0;
};

export const refreshSession = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    // Clear cache on refresh
    clearUserCache();
    
    if (error || !data?.session) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // Check cache first
  const now = Date.now();
  if (cachedUser && (now - cacheTimestamp) < CACHE_TTL) {
    console.log("Using cached user data");
    return cachedUser;
  }

  // Prevent multiple concurrent requests
  if (pendingUserFetch) {
    console.log("User fetch already pending, waiting for result");
    return await pendingUserFetch;
  }

  pendingUserFetch = (async (): Promise<AuthUser | null> => {
    try {
      // Enhanced session validation
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Session retrieval error:', sessionError.message);
        clearUserCache();
        return null;
      }
      
      if (!sessionData?.session) {
        console.log("No active session found");
        clearUserCache();
        return null;
      }

      // Check if session is expired
      const session = sessionData.session;
      if (session.expires_at && session.expires_at * 1000 < Date.now()) {
        console.log("Session is expired, attempting refresh");
        const refreshSuccess = await refreshSession();
        if (!refreshSuccess) {
          clearUserCache();
          return null;
        }
        // Get the refreshed session
        const { data: refreshedSessionData } = await supabase.auth.getSession();
        if (!refreshedSessionData?.session) {
          clearUserCache();
          return null;
        }
      }
      
      // Verify the session is valid by checking the user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.warn('User verification error:', userError.message);
        clearUserCache();
        return null;
      }

      if (!userData?.user) {
        console.log("No user data found in session");
        clearUserCache();
        return null;
      }
      
      const user = userData.user;
      
      // Fetch user role from user_roles table (single source of truth)
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      // Enhanced user object construction with validation
      const authUser: AuthUser = {
        id: user.id,
        email: user.email || '',
        role: roleData?.role || 'user',
        firstName: user.user_metadata?.firstName || '',
        lastName: user.user_metadata?.lastName || '',
      };
      
      // Update cache
      cachedUser = authUser;
      cacheTimestamp = now;
      
      console.log("Successfully retrieved and cached user data");
      return authUser;
    } catch (error) {
      console.error('Critical error getting current user:', error);
      clearUserCache();
      return null;
    } finally {
      pendingUserFetch = null;
    }
  })();

  return await pendingUserFetch;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
  });

  if (error) {
    throw error;
  }
};

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw error;
  }
};

// Update user profile metadata
export const updateUserProfile = async (profileData: UserProfileUpdate) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      // Add other profile data as needed
    }
  });

  if (error) {
    throw error;
  }

  // Clear cache when updating profile
  clearUserCache();
  return data.user;
};

// Update user password
export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  // Supabase doesn't have a direct method to verify current password before changing
  // We can simulate this by trying to sign in with the current password first
  
  // Get current user's email
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.email) {
    throw new Error("Nie można znaleźć danych użytkownika");
  }
  
  try {
    // Verify current password works
    await signIn({ email: currentUser.email, password: currentPassword });
    
    // If we get here, the password is correct, so update to the new password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    // If the sign-in fails, the current password is incorrect
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Obecne hasło jest nieprawidłowe");
    }
    throw error;
  }
};
