
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      toast({
        title: "Brak dostępu",
        description: "Wymagane są uprawnienia administratora",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, isAdmin, navigate, toast]);

  if (isLoading || !isAuthenticated || !isAdmin()) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
