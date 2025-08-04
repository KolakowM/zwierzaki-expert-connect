
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
  // Enhanced session verification with better throttling and error handling
  let lastVerifiedTimestamp = 0;
  let verificationInProgress = false;
  const VERIFICATION_THROTTLE = 15000; // Increased to 15 seconds for better stability
  const MAX_RETRY_ATTEMPTS = 3;
  
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
    
    // Enhanced throttling with progress tracking
    if (verificationInProgress) {
      console.log("Session verification already in progress, skipping");
      return !!user;
    }
    
    if (now - lastVerifiedTimestamp < VERIFICATION_THROTTLE) {
      console.log("Session verification throttled - returning cached result");
      return !!user;
    }
    
    verificationInProgress = true;
    let retryCount = 0;
    
    try {
      setIsLoading(true);
      lastVerifiedTimestamp = now;
      
      // If we already have a valid user, just verify the session is still active
      if (user) {
        try {
          const sessionValid = await getCurrentUser();
          if (sessionValid?.id === user.id) {
            return true;
          }
        } catch (error) {
          console.log("Current user check failed, proceeding with full verification");
        }
      }
      
      // Retry logic for better reliability
      while (retryCount < MAX_RETRY_ATTEMPTS) {
        try {
          // Try to get current user from session
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            return true;
          }
          
          // If no current session, try to refresh
          console.log(`Session refresh attempt ${retryCount + 1}`);
          const refreshed = await refreshSession();
          if (refreshed) {
            const refreshedUser = await getCurrentUser();
            if (refreshedUser) {
              setUser(refreshedUser);
              return true;
            }
          }
          
          retryCount++;
          if (retryCount < MAX_RETRY_ATTEMPTS) {
            // Exponential backoff between retries
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        } catch (error) {
          console.error(`Session verification attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          if (retryCount < MAX_RETRY_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
      }
      
      // All attempts failed
      console.warn("Session verification failed after all retry attempts");
      setUser(null);
      return false;
    } catch (error) {
      console.error("Critical session verification error:", error);
      return false;
    } finally {
      verificationInProgress = false;
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
