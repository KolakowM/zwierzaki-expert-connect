
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signIn, signOut, signUp, AuthUser, SignInCredentials, SignUpCredentials } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: SignInCredentials) => Promise<void>;
  register: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const refreshUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const updatedUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'user',
            firstName: session.user.user_metadata?.first_name,
            lastName: session.user.user_metadata?.last_name,
          };
          setUser(updatedUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
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
      toast({
        title: "Zalogowano pomyślnie",
        description: "Witamy z powrotem w systemie!"
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

  const register = async (credentials: SignUpCredentials) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            role: 'user',
            status: 'pending'
          },
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        try {
          const { createUserRole } = await import('@/services/user/createRole');
          await createUserRole(data.user.id, 'user', 'niezweryfikowany');
        } catch (roleError) {
          console.error("Błąd podczas tworzenia roli użytkownika:", roleError);
        }
        
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          firstName: credentials.firstName || "",
          lastName: credentials.lastName || "",
        });
        
        // Użytkownik jest teraz zalogowany
        toast({
          title: "Rejestracja pomyślna",
          description: "Twoje konto zostało utworzone!"
        });
        
        navigate("/dashboard");
        return data.user;
      }
      return null;
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
        title: "Wylogowano pomyślnie",
        description: "Dziękujemy za korzystanie z systemu."
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
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isAdmin,
    refreshUserData,
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
