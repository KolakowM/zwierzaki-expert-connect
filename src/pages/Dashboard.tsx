
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"; 
import DashboardTabs from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check authentication state after loading is complete
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Dostęp zabroniony",
        description: "Musisz być zalogowany, aby zobaczyć panel",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // If we get past the effect, we're authenticated
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Panel główny</h1>
        <DashboardTabs />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
