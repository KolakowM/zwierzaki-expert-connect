
import React, { createContext, useContext, ReactNode } from "react";
import { AuthUser } from "@/services/authService";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthListeners } from "@/hooks/useAuthListeners";
import { useAuthMethods } from "@/hooks/useAuthMethods";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: ReturnType<typeof useAuthMethods>['login'];
  register: ReturnType<typeof useAuthMethods>['register'];
  logout: ReturnType<typeof useAuthMethods>['logout'];
  isAdmin: ReturnType<typeof useAuthMethods>['isAdmin'];
  refreshUserData: ReturnType<typeof useAuthMethods>['refreshUserData'];
  verifySession: ReturnType<typeof useAuthMethods>['verifySession'];
}

// Create context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    sessionChecked,
    setSessionChecked,
    isAuthenticated 
  } = useAuthState();

  // Initialize auth listeners with the current state
  // We only pass the necessary state setters, not any methods that would cause circular dependencies
  useAuthListeners({ user, setUser, setSessionChecked, setIsLoading });

  const {
    login,
    register,
    logout,
    verifySession,
    refreshUserData,
    isAdmin
  } = useAuthMethods({ user, setUser, setIsLoading });

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    isAdmin,
    refreshUserData,
    verifySession,
  };

  // Only log when values change to avoid excessive logging
  React.useEffect(() => {
    console.log("AuthProvider state:", { isLoading, isAuthenticated, sessionChecked, hasUser: !!user });
  }, [isLoading, isAuthenticated, sessionChecked, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the useAuth hook with proper error handling
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
