
import { ReactNode, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthProvider";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, isLoading, verifySession, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await verifySession();
        
        if (!isValid) {
          toast({
            title: "Brak dostępu",
            description: "Musisz być zalogowany, aby uzyskać dostęp do tego obszaru",
            variant: "destructive"
          });
          navigate("/login");
          return;
        }
        
        // Additional check for admin access
        if (!isAdmin()) {
          toast({
            title: "Brak uprawnień",
            description: "Tylko administratorzy mają dostęp do tego obszaru",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [verifySession, navigate, toast, isAdmin]);

  if (isLoading || !authChecked) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Additional protection - if not authenticated after checking, don't show anything
  if (!isAuthenticated && authChecked) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
