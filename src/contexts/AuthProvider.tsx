
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, signIn, signOut, signUp, refreshSession, AuthUser, SignInCredentials, SignUpCredentials } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: SignInCredentials) => Promise<void>;
  register: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  refreshUserData: () => Promise<void>;
  verifySession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Session verification function
  const verifySession = async (): Promise<boolean> => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // Also try to refresh the session
      if (!currentUser) {
        await refreshSession();
        // Check again after refresh attempt
        const refreshedUser = await getCurrentUser();
        setUser(refreshedUser);
        return !!refreshedUser;
      }
      
      return !!currentUser;
    } catch (error) {
      console.error("Error verifying session:", error);
      return false;
    }
  };

  const refreshUserData = async () => {
    if (!sessionChecked) return;
    
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on route changes
  useEffect(() => {
    if (sessionChecked) {
      verifySession();
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // First try to get user from current session
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
        setSessionChecked(true);
      }
    };

    loadUser();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const updatedUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'specialist',
            firstName: session.user.user_metadata?.firstName,
            lastName: session.user.user_metadata?.lastName,
          };
          setUser(updatedUser);
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setUser(null);
          // Force redirect to login on sign out
          if (
            !location.pathname.includes('/login') && 
            !location.pathname.includes('/register') && 
            !location.pathname === '/'
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

  const login = async (credentials: SignInCredentials) => {
    try {
      setIsLoading(true);
      await signIn(credentials);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (!currentUser) {
        throw new Error("Nie udało się zalogować. Spróbuj ponownie.");
      }
      
      toast({
        title: t("auth.login_success"),
        description: t("auth.login_welcome")
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Błąd logowania",
        description: error.message || "Sprawdź swoje dane i spróbuj ponownie.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: SignUpCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      await signUp(credentials);
      
      // We need to explicitly sign in after registration
      try {
        await signIn({
          email: credentials.email,
          password: credentials.password
        });
      } catch (signInError) {
        console.error("Auto sign-in after registration failed:", signInError);
        // Continue with registration process even if auto sign-in fails
      }
      
      // Fetch updated user data
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        
        toast({
          title: t("auth.register_success"),
          description: t("auth.register_welcome")
        });
        
        navigate("/dashboard");
      } else {
        // If we couldn't get the user after registration, direct to login
        toast({
          title: t("auth.register_success"),
          description: "Możesz teraz się zalogować."
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Błąd rejestracji",
        description: error.message || "Spróbuj ponownie z innym adresem email.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      toast({
        title: t("auth.logout_success"),
        description: t("auth.logout_goodbye")
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Błąd wylogowania",
        description: error.message || "Spróbuj ponownie później.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user && sessionChecked,
    login,
    register,
    logout,
    isAdmin,
    refreshUserData,
    verifySession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
