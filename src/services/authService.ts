
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

export const signIn = async ({ email, password }: SignInCredentials) => {
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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
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
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data } = await supabase.auth.getSession();
  
  if (!data.session) {
    return null;
  }
  
  const { user } = data.session;
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email || '',
    role: user.user_metadata?.role || 'user',
    firstName: user.user_metadata?.first_name,
    lastName: user.user_metadata?.last_name,
  };
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

// New functions for account settings

// Update user profile metadata
export const updateUserProfile = async (profileData: UserProfileUpdate) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      // Add other profile data as needed
    }
  });

  if (error) {
    throw error;
  }

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
