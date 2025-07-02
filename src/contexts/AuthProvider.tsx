
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
  subscriptionStatus: any;
  refreshSubscriptionStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, setUser, setIsLoading } = useAuthState();
  const { login, register, logout, resetPassword, updatePassword } = useAuthMethods(setUser, setIsLoading);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useAuthListeners(setUser, setIsLoading);

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
