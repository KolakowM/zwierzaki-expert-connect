
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/clients/${pet.clientId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Powrót do klienta
            </Link>
          </Button>

          <div className="flex gap-2">
            <ResponsivePetForm 
              clientId={pet.clientId} 
              defaultValues={pet}
              isEditing={true}
              onPetSaved={handlePetUpdated}
              buttonText="Edytuj profil"
              title={`Edytuj dane: ${pet.name}`}
            />
            {/* TODO: Add Delete Pet button here */}
          </div>
        </div>

        <PetHeader 
          pet={pet} 
          clientId={pet.clientId}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="visits">Wizyty ({visits.length})</TabsTrigger>
            <TabsTrigger value="care">Programy opieki</TabsTrigger>
            <TabsTrigger value="notes">Notatki</TabsTrigger>
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

          <TabsContent value="notes">
            <div className="text-muted-foreground text-center py-8">
              Funkcjonalność notatek będzie dostępna wkrótce
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PetProfile;
