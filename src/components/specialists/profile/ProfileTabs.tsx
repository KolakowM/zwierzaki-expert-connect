
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutTab } from "./AboutTab";
import { ServicesTab } from "./ServicesTab";
import { QualificationsTab } from "./QualificationsTab";

interface ProfileTabsProps {
  specialist: {
    description: string;
    experience: string;
    services: string[];
    education: string[];
  };
}

export function ProfileTabs({ specialist }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="about" className="flex-1">O mnie</TabsTrigger>
        <TabsTrigger value="services" className="flex-1">Usługi</TabsTrigger>
        <TabsTrigger value="qualifications" className="flex-1">Kwalifikacje</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="mt-6">
        <AboutTab 
          description={specialist.description} 
          experience={specialist.experience} 
        />
      </TabsContent>
      
      <TabsContent value="services" className="mt-6">
        <ServicesTab services={specialist.services} />
      </TabsContent>
      
      <TabsContent value="qualifications" className="mt-6">
        <QualificationsTab education={specialist.education} />
      </TabsContent>
    </Tabs>
  );
}
