
import { useState, useCallback } from "react";
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

  // Create a safe setter for isLoading to prevent rapid toggling
  const updateLoadingState = useCallback((loading: boolean) => {
    setIsLoading((prevLoading) => {
      // Only update to false if it was true before or force update to true
      if (prevLoading === true || loading === true) {
        return loading;
      }
      return prevLoading;
    });
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading: updateLoadingState,
    sessionChecked,
    setSessionChecked,
    isAuthenticated: !!user && sessionChecked,
  };
}
