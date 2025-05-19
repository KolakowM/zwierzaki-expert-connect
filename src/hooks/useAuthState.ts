
import { useState } from "react";
import { AuthUser } from "@/services/authService";

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  sessionChecked: boolean;
}

export function useAuthState() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    sessionChecked,
    setSessionChecked,
    isAuthenticated: !!user && sessionChecked,
  };
}
