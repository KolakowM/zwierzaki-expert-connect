
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCurrentUser, signIn, signOut, signUp, refreshSession, SignInCredentials, SignUpCredentials } from "@/services/authService";
import { AuthState } from "./useAuthState";

export function useAuthMethods(
  { user, setUser, setIsLoading }: Pick<AuthState & {
    setUser: (user: any) => void;
    setIsLoading: (loading: boolean) => void;
  }, "user" | "setUser" | "setIsLoading">
) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const login = async (credentials: SignInCredentials) => {
    try {
      setIsLoading(true);
      console.log("Login attempt for:", credentials.email);
      await signIn(credentials);
      
      // Let the auth listener handle the user state update
      // We check the result here just to ensure no errors
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        throw new Error("Nie udało się zalogować. Spróbuj ponownie.");
      }
      
      toast({
        title: t("auth.login_success"),
        description: t("auth.login_welcome")
      });
      
      // Let the auth state listener handle navigation
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
      console.log("Register attempt for:", credentials.email);
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
      
      // Let the auth listener handle the user state update and navigation
      // We check the result here just to ensure no errors
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        
        toast({
          title: t("auth.register_success"),
          description: t("auth.register_welcome")
        });
        
        // Let the auth state listener handle navigation
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

  const verifySession = async (): Promise<boolean> => {
    try {
      console.log("Verifying session");
      const currentUser = await getCurrentUser();
      
      // If no user found, try to refresh the session
      if (!currentUser) {
        try {
          const refreshed = await refreshSession();
          if (!refreshed) {
            setUser(null);
            return false;
          }
          
          // Check again after refresh attempt
          const refreshedUser = await getCurrentUser();
          setUser(refreshedUser);
          return !!refreshedUser;
        } catch (refreshError) {
          console.error("Error refreshing session:", refreshError);
          setUser(null);
          return false;
        }
      } else {
        setUser(currentUser);
        return true;
      }
    } catch (error) {
      console.error("Error verifying session:", error);
      setUser(null);
      return false;
    }
  };

  const refreshUserData = async () => {
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

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    login,
    register,
    logout,
    verifySession,
    refreshUserData,
    isAdmin
  };
}
