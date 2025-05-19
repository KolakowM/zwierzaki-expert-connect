
import { ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthProvider";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, isLoading, verifySession } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isValidSession = await verifySession();
      
      if (!isValidSession) {
        toast({
          title: "Brak dostępu",
          description: "Musisz być zalogowany, aby uzyskać dostęp do tego obszaru",
          variant: "destructive"
        });
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [verifySession, navigate, toast]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
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
