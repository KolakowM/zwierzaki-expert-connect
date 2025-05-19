
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

// Import dashboard components
import UserMenu from "@/components/dashboard/UserMenu";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ClientsTab from "@/components/dashboard/ClientsTab";
import AnimalsTab from "@/components/dashboard/AnimalsTab";
import CalendarTab from "@/components/dashboard/CalendarTab";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [specialistProfile, setSpecialistProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Get the tab from URL query parameter or default to "overview"
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromQuery || "overview");
  
  useEffect(() => {
    // Only fetch profile if we have a user
    if (user?.id && !specialistProfile) {
      fetchSpecialistProfile(user.id);
    }
  }, [user?.id]);

  const fetchSpecialistProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('specialist_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setSpecialistProfile(data);
      }
    } catch (error) {
      console.error('Error fetching specialist profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

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

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

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
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="clients">Klienci</TabsTrigger>
            <TabsTrigger value="animals">Zwierzęta</TabsTrigger>
            <TabsTrigger value="calendar">Kalendarz</TabsTrigger>
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
