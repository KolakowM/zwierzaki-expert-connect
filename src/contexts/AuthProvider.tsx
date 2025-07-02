
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { useAuthListeners } from '@/hooks/useAuthListeners';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  verifySession: () => Promise<boolean>;
  refreshUserData: () => Promise<any>;
  isAdmin: () => boolean;
  subscriptionStatus: any;
  refreshSubscriptionStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, setUser, setIsLoading, sessionChecked, setSessionChecked } = useAuthState();
  const { login, register, logout, verifySession, refreshUserData, isAdmin } = useAuthMethods({ user, setUser, setIsLoading });
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useAuthListeners({ user, setUser, setSessionChecked, setIsLoading });

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Reset password error:", error);
      return { error: error.message || "Failed to send reset email" };
    }
  };

  // Update password function
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Update password error:", error);
      return { error: error.message || "Failed to update password" };
    }
  };

  // Function to check subscription status
  const refreshSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (!error && data) {
        setSubscriptionStatus(data);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Check subscription status when user changes
  useEffect(() => {
    if (user && isAuthenticated) {
      refreshSubscriptionStatus();
    } else {
      setSubscriptionStatus(null);
    }
  }, [user, isAuthenticated]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login: async (email: string, password: string) => {
      const result = await login(email, password);
      if (result === true) {
        // Check subscription status after successful login
        setTimeout(refreshSubscriptionStatus, 1000);
      }
      return result;
    },
    register,
    logout: async () => {
      await logout();
      setSubscriptionStatus(null);
    },
    resetPassword,
    updatePassword,
    verifySession,
    refreshUserData,
    isAdmin,
    subscriptionStatus,
    refreshSubscriptionStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
