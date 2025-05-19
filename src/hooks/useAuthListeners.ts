
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthState } from "./useAuthState";
import { getCurrentUser, refreshSession } from "@/services/authService";

export function useAuthListeners(
  { user, setUser, setSessionChecked }: Pick<AuthState & {
    setUser: (user: any) => void;
    setSessionChecked: (checked: boolean) => void;
  }, "user" | "setUser" | "setSessionChecked">
) {
  const navigate = useNavigate();
  const location = useLocation();

  // Set up auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const updatedUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'specialist',
            firstName: session.user.user_metadata?.firstName,
            lastName: session.user.user_metadata?.lastName,
          };
          setUser(updatedUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          // Force redirect to login on sign out
          if (
            !location.pathname.includes('/login') && 
            !location.pathname.includes('/register') && 
            location.pathname !== '/'
          ) {
            navigate('/login');
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // Refresh user data when token is refreshed
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Check authentication on route changes
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      const verifyAuth = async () => {
        try {
          const isValid = await refreshSession();
          if (!isValid && !location.pathname.startsWith('/reset-password')) {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          }
        } catch (error) {
          console.error('Error verifying session on route change:', error);
        }
      };

      verifyAuth();
    }
  }, [location.pathname]);

  // Initial auth check
  useEffect(() => {
    const loadUser = async () => {
      try {
        // First try to get user from current session
        const currentUser = await getCurrentUser();
        
        // If no user found, try to refresh the session
        if (!currentUser) {
          try {
            const refreshed = await refreshSession();
            if (refreshed) {
              const refreshedUser = await getCurrentUser();
              setUser(refreshedUser);
            }
          } catch (refreshError) {
            console.error("Error refreshing session:", refreshError);
          }
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setSessionChecked(true);
      }
    };

    loadUser();
  }, []);
}
