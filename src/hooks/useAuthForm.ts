
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

export function useAuthForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    authLoading,
    isAuthenticated,
    navigate
  };
}
