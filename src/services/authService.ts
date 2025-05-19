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

// Caching mechanism for getCurrentUser to reduce redundant calls
let cachedUser: AuthUser | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30000; // 30 seconds

export const signIn = async ({ email, password }: SignInCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  // Update cache when signing in
  clearUserCache();
  return data.user;
};

export const signUp = async ({ email, password, firstName, lastName }: SignUpCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastName,
        role: 'specialist'
      },
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
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

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  // Check cache first
  const now = Date.now();
  if (cachedUser && (now - cacheTimestamp) < CACHE_TTL) {
    console.log("Using cached user data");
    return cachedUser;
  }

  try {
    // Get the current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      clearUserCache();
      return null;
    }
    
    if (!sessionData?.session) {
      clearUserCache();
      return null;
    }
    
    // Verify the session is valid by checking the user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      console.error('User verification error:', userError);
      clearUserCache();
      return null;
    }
    
    const user = userData.user;
    
    const authUser = {
      id: user.id,
      email: user.email || '',
      role: user.user_metadata?.role || 'specialist',
      firstName: user.user_metadata?.firstName,
      lastName: user.user_metadata?.lastName,
    };
    
    // Update cache
    cachedUser = authUser;
    cacheTimestamp = now;
    
    return authUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    clearUserCache();
    return null;
  }
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
