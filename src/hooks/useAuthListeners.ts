
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
  
  // Set up auth listener
  useEffect(() => {
    console.log("Setting up auth state change listener");
    let isMounted = true;
    
    // Use a flag to track if we've already loaded user data
    let initialUserLoaded = false;
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
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
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSessionChecked(true);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Use setTimeout to avoid circular updates and defer after current operation
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              const currentUser = await getCurrentUser();
              if (isMounted) {
                setUser(currentUser);
                setSessionChecked(true);
              }
            } finally {
              if (isMounted) {
                setIsLoading(false);
              }
            }
          }, 0);
        } else if (event === 'INITIAL_SESSION') {
          // Handle initial session without redirecting
          if (session?.user) {
            const updatedUser = {
              id: session.user.id,
              email: session.user.email || '',
              role: session.user.user_metadata?.role || 'specialist',
              firstName: session.user.user_metadata?.firstName,
              lastName: session.user.user_metadata?.lastName,
            };
            setUser(updatedUser);
          }
          setSessionChecked(true);
          setIsLoading(false);
        }
      }
    );

    // Only run initial auth check if no listener events have fired yet
    const loadUser = async () => {
      try {
        if (!isMounted) return;
        if (initialUserLoaded) return;
        
        // First try to get user from current session
        const currentUser = await getCurrentUser();
        
        // If no user found, try to refresh the session
        if (!currentUser && isMounted) {
          try {
            const refreshed = await refreshSession();
            if (refreshed && isMounted) {
              initialUserLoaded = true;
              const refreshedUser = await getCurrentUser();
              setUser(refreshedUser);
            }
          } catch (refreshError) {
            console.error("Error refreshing session:", refreshError);
          }
        } else if (isMounted) {
          initialUserLoaded = true;
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    };
    
    // Load user data with a small delay to avoid race conditions with the listener
    setTimeout(loadUser, 100);

    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
}
