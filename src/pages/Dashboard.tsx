
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const [specialistProfile, setSpecialistProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get the tab from URL query parameter or default to "overview"
  const tabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromQuery || "overview");

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby zobaczyć ten panel",
        variant: "destructive"
      });
      navigate("/login");
    } else if (user?.id) {
      fetchSpecialistProfile(user.id);
    }
  }, [isAuthenticated, navigate, toast, user?.id]);

  const fetchSpecialistProfile = async (userId: string) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // Update URL when tab changes - fixed to prevent re-renders
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Use replace:true to prevent adding to history stack
    // Use a callback to access current search params
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value !== "overview") {
        newParams.set('tab', value);
      } else {
        newParams.delete('tab');
      }
      return newParams;
    }, { replace: true });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Wylogowano pomyślnie",
      description: "Do zobaczenia wkrótce!",
    });
    navigate("/");
  };

  if (!isAuthenticated) {
    return <div />;
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

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="space-y-4">
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
