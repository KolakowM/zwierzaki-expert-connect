
import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

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
