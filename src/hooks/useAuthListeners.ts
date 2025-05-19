
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
          // Refresh user data when token is refreshed without triggering a loading state
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

    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Initial auth check - only run once on component mount
  useEffect(() => {
    console.log("Running initial auth check");
    let isMounted = true;
    
    const loadUser = async () => {
      try {
        if (!isMounted) return;
        
        // First try to get user from current session
        const currentUser = await getCurrentUser();
        
        // If no user found, try to refresh the session
        if (!currentUser && isMounted) {
          try {
            const refreshed = await refreshSession();
            if (refreshed && isMounted) {
              const refreshedUser = await getCurrentUser();
              setUser(refreshedUser);
            }
          } catch (refreshError) {
            console.error("Error refreshing session:", refreshError);
          }
        } else if (isMounted) {
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

    loadUser();
    
    return () => {
      isMounted = false;
    };
  }, []);
}
