
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PetHeader from "@/components/pets/PetHeader";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";
import PetCarePrograms from "@/components/care-programs/PetCarePrograms";
import PetVisitsList from "@/components/pets/PetVisitsList";
import PetProfileLoader from "@/components/pets/PetProfileLoader";
import PetNotFound from "@/components/pets/PetNotFound";
import PetOverviewTab from "@/components/pets/tabs/PetOverviewTab";
import { usePetProfile } from "@/hooks/use-pet-profile";

const PetProfile = () => {
  const {
    pet,
    visits,
    isPetLoading,
    activeTab,
    setActiveTab,
    handlePetUpdated,
    handleVisitUpdated
  } = usePetProfile();

  if (isPetLoading) {
    return <PetProfileLoader />;
  }

  if (!pet) {
    return <PetNotFound />;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to={`/clients/${pet.clientId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Powrót do klienta
            </Link>
          </Button>
        </div>

        <PetHeader 
          pet={pet} 
          clientId={pet.clientId}
          actionButton={
            <ResponsivePetForm 
              clientId={pet.clientId} 
              defaultValues={pet}
              isEditing={true}
              onPetSaved={handlePetUpdated}
              buttonText="Edytuj dane"
              title={`Edytuj dane: ${pet.name}`}
            />
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="visits">Wizyty</TabsTrigger>
            <TabsTrigger value="care">Programy opieki</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <PetOverviewTab pet={pet} />
          </TabsContent>

          <TabsContent value="visits">
            <PetVisitsList 
              pet={pet} 
              visits={visits} 
              clientId={pet.clientId} 
              onVisitUpdated={handleVisitUpdated}
            />
          </TabsContent>
          
          <TabsContent value="care">
            <PetCarePrograms petId={pet.id} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PetProfile;
