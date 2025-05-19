
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
          setSessionChecked(true);
          
          // Don't navigate if already on dashboard
          if (!location.pathname.includes('/dashboard')) {
            navigate('/dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSessionChecked(true);
          
          // Only redirect if on a protected route
          const publicRoutes = ['/login', '/register', '/', '/about', '/pricing', '/contact'];
          if (!publicRoutes.some(route => location.pathname.includes(route))) {
            navigate('/login');
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // Refresh user data when token is refreshed
          setIsLoading(true);
          try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          } finally {
            setIsLoading(false);
            setSessionChecked(true);
          }
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Initial auth check - only run once on component mount
  useEffect(() => {
    console.log("Running initial auth check");
    const loadUser = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
        setSessionChecked(true);
      }
    };

    loadUser();
  }, []);
}
