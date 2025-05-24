
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Import dashboard components
import UserMenu from "@/components/dashboard/UserMenu";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ClientsTab from "@/components/dashboard/ClientsTab";
import AnimalsTab from "@/components/dashboard/AnimalsTab";
import CalendarTab from "@/components/dashboard/CalendarTab";
import SubscriptionManagement from "@/components/subscription/SubscriptionManagement";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get the tab from URL query parameter or default to "overview"
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');
  
  // Set the active tab only once on component mount to avoid unnecessary rerenders
  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, []);

  // Fetch specialist profile using React Query for proper caching
  const { data: specialistProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['specialistProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('specialist_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 60000, // Cache for 1 minute
  });

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard${value !== "overview" ? `?tab=${value}` : ""}`, { replace: true });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Wylogowano pomyślnie",
      description: "Do zobaczenia wkrótce!",
    });
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Panel Specjalisty</h1>
          <div className="flex items-center gap-4">
            <UserMenu 
              firstName={user?.firstName} 
              lastName={user?.lastName} 
              onLogout={handleLogout}
              photoUrl={specialistProfile?.photo_url} 
            />
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 md:w-auto md:grid-cols-5">
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="clients">Klienci</TabsTrigger>
            <TabsTrigger value="animals">Zwierzęta</TabsTrigger>
            <TabsTrigger value="calendar">Kalendarz</TabsTrigger>
            <TabsTrigger value="subscription">Subskrypcja</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <DashboardOverview />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <ClientsTab />
          </TabsContent>
          
          <TabsContent value="animals" className="space-y-4">
            <AnimalsTab />
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <CalendarTab />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <SubscriptionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
