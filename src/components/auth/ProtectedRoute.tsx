
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import AuthLoadingScreen from "./AuthLoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, verifySession } = useAuth();
  const location = useLocation();
  
  // Log less frequently to reduce console noise
  useEffect(() => {
    console.log("ProtectedRoute status:", { 
      isAuthenticated, 
      isLoading, 
      path: location.pathname
    });
  }, [isAuthenticated, isLoading, location.pathname]);
  
  // Enhanced session verification with better error handling
  useEffect(() => {
    // Only verify if we're not already loading and don't have a user
    if (!isLoading && !isAuthenticated) {
      verifySession().catch((error) => {
        console.error("Protected route session verification failed:", error);
        // Don't block the user, let the auth context handle the redirect
      });
    }
  }, [isLoading, isAuthenticated, verifySession]);
  
  if (isLoading) {
    return <AuthLoadingScreen />;
  }
  
  if (!isAuthenticated) {
    // Save the current location they were trying to go to when redirecting
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
