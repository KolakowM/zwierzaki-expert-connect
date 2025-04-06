
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "specialist" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage in this mock implementation)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user with admin role if email contains "admin"
      const role = email.includes("admin") ? "admin" : "specialist";
      const mockUser: User = {
        id: "1",
        email,
        firstName: "Jan",
        lastName: "Kowalski",
        role: role
      };
      
      // Store user in localStorage (would be a token in a real app)
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
