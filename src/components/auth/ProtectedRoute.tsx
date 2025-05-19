
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
  
  // Verify session only once when component mounts, not on every render
  useEffect(() => {
    // Only verify if we're not already loading
    if (!isLoading) {
      verifySession();
    }
  }, []);
  
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
