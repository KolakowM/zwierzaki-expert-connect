
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

export function useAuthForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  
  const { verifySession } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await verifySession();
        setAuthenticated(isValid);
        
        if (isValid) {
          navigate('/dashboard');
        }
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [verifySession, navigate]);

  return {
    error,
    setError,
    isLoading,
    setIsLoading,
    authChecked,
    authenticated,
    navigate
  };
}
