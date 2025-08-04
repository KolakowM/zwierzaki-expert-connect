
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthState } from "./useAuthState";
import { getCurrentUser, refreshSession } from "@/services/authService";

export function useAuthListeners(
  { user, setUser, setSessionChecked, setIsLoading }: Pick<AuthState & {
    setUser: (user: any) => void;
    setSessionChecked: (checked: boolean) => void;
    setIsLoading: (loading: boolean) => void;
  }, "user" | "setUser" | "setSessionChecked" | "setIsLoading">
) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set up auth listener with enhanced error handling and stability
  useEffect(() => {
    console.log("Setting up auth state change listener");
    let isMounted = true;
    let initialUserLoaded = false;
    let authEventQueue: Array<{ event: string; session: any }> = [];
    let processingEvents = false;
    
    // Enhanced event processing with queue to prevent race conditions
    const processAuthEvent = async (event: string, session: any) => {
      if (!isMounted) return;

      try {
        console.log("Processing auth event:", event, session ? "with session" : "without session");

        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              const updatedUser = {
                id: session.user.id,
                email: session.user.email || '',
                role: session.user.user_metadata?.role || 'specialist',
                firstName: session.user.user_metadata?.firstName,
                lastName: session.user.user_metadata?.lastName,
              };
              setUser(updatedUser);
              setSessionChecked(true);
              setIsLoading(false);
            }
            break;

          case 'SIGNED_OUT':
            setUser(null);
            setSessionChecked(true);
            setIsLoading(false);
            break;

          case 'TOKEN_REFRESHED':
            // Enhanced token refresh handling with error recovery
            try {
              const currentUser = await getCurrentUser();
              if (isMounted && currentUser) {
                setUser(currentUser);
                setSessionChecked(true);
              }
            } catch (error) {
              console.warn("Token refresh failed, user will need to re-login:", error);
              setUser(null);
              setSessionChecked(true);
            } finally {
              if (isMounted) {
                setIsLoading(false);
              }
            }
            break;

          case 'INITIAL_SESSION':
            if (session?.user) {
              const updatedUser = {
                id: session.user.id,
                email: session.user.email || '',
                role: session.user.user_metadata?.role || 'specialist',
                firstName: session.user.user_metadata?.firstName,
                lastName: session.user.user_metadata?.lastName,
              };
              setUser(updatedUser);
            } else {
              setUser(null);
            }
            setSessionChecked(true);
            setIsLoading(false);
            break;

          default:
            console.log("Unhandled auth event:", event);
        }
      } catch (error) {
        console.error("Error processing auth event:", event, error);
        // Fallback to safe state
        setSessionChecked(true);
        setIsLoading(false);
      }
    };

    // Event queue processor to handle multiple rapid events
    const processEventQueue = async () => {
      if (processingEvents || authEventQueue.length === 0) return;
      
      processingEvents = true;
      while (authEventQueue.length > 0 && isMounted) {
        const { event, session } = authEventQueue.shift()!;
        await processAuthEvent(event, session);
      }
      processingEvents = false;
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        // Add event to queue for orderly processing
        authEventQueue.push({ event, session });
        
        // Process queue after a small delay to batch rapid events
        setTimeout(processEventQueue, 50);
      }
    );

    // Enhanced initial user loading with better error handling
    const loadUser = async () => {
      if (!isMounted || initialUserLoaded) return;
      
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts && isMounted && !initialUserLoaded) {
        try {
          console.log(`Initial user load attempt ${attempts + 1}`);
          
          // Try to get user from current session
          const currentUser = await getCurrentUser();
          
          if (currentUser && isMounted) {
            initialUserLoaded = true;
            setUser(currentUser);
            setSessionChecked(true);
            setIsLoading(false);
            return;
          }
          
          // If no user found and it's first attempt, try to refresh session
          if (attempts === 0 && isMounted) {
            try {
              console.log("No current user found, attempting session refresh");
              const refreshed = await refreshSession();
              if (refreshed && isMounted) {
                const refreshedUser = await getCurrentUser();
                if (refreshedUser) {
                  initialUserLoaded = true;
                  setUser(refreshedUser);
                  setSessionChecked(true);
                  setIsLoading(false);
                  return;
                }
              }
            } catch (refreshError) {
              console.warn("Session refresh failed:", refreshError);
            }
          }
          
          attempts++;
          if (attempts < maxAttempts && isMounted) {
            // Exponential backoff between attempts
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 500));
          }
        } catch (error) {
          console.error(`Error loading user (attempt ${attempts + 1}):`, error);
          attempts++;
          if (attempts < maxAttempts && isMounted) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 500));
          }
        }
      }
      
      // If all attempts failed, set default state
      if (isMounted) {
        initialUserLoaded = true;
        setUser(null);
        setSessionChecked(true);
        setIsLoading(false);
        console.log("Initial user loading completed - no valid session found");
      }
    };
    
    // Load user data with optimized timing
    const timeoutId = setTimeout(loadUser, 200);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      authEventQueue = [];
      processingEvents = false;
      
      if (authListener && authListener.subscription) {
        try {
          authListener.subscription.unsubscribe();
        } catch (error) {
          console.warn("Error unsubscribing from auth listener:", error);
        }
      }
    };
  }, []);
}
