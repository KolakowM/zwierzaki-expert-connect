
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  refreshSession,
  AuthUser
} from "@/services/authService";

type AuthMethodsParams = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export function useAuthMethods({ user, setUser, setIsLoading }: AuthMethodsParams) {
  // Cache verification timestamp to prevent excessive checks
  let lastVerifiedTimestamp = 0;
  const VERIFICATION_THROTTLE = 10000; // 10 seconds
  
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signIn({ email, password });
      // We don't need to explicitly set the user here as the auth state listener will handle it
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      return { error: error.message || "Failed to login" };
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const register = useCallback(async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setIsLoading(true);
      await signUp({ email, password, firstName, lastName });
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      return { error: error.message || "Failed to register" };
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  const verifySession = useCallback(async (): Promise<boolean> => {
    const now = Date.now();
    
    // Don't verify too frequently to reduce database calls
    if (now - lastVerifiedTimestamp < VERIFICATION_THROTTLE) {
      console.log("Session verification throttled");
      // If we already have a user, trust it for the throttle period
      return !!user;
    }
    
    try {
      setIsLoading(true);
      lastVerifiedTimestamp = now;
      
      // First check if we already have the user in state
      if (user) {
        return true;
      }
      
      // If no user in state, try to get from current session
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        return true;
      }
      
      // If no current session, try to refresh the session
      const refreshed = await refreshSession();
      if (refreshed) {
        const refreshedUser = await getCurrentUser();
        if (refreshedUser) {
          setUser(refreshedUser);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Session verification error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser, setIsLoading]);

  const refreshUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  return {
    login,
    register,
    logout,
    verifySession,
    refreshUserData,
    isAdmin
  };
}
