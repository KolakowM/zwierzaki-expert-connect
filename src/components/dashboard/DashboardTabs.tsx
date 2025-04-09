
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from "./DashboardOverview";
import ClientsTab from "./ClientsTab";
import AnimalsTab from "./AnimalsTab";
import CalendarTab from "./CalendarTab";

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
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
  );
};

export default DashboardTabs;
