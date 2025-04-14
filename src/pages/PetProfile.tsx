import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PetHeader from "@/components/pets/PetHeader";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";
import PetCarePrograms from "@/components/care-programs/PetCarePrograms";
import PetVisitsList from "@/components/pets/PetVisitsList";
import { getPetById } from "@/services/petService";
import { getVisitsByPetId } from "@/services/visitService";
import { Pet, Visit } from "@/types";
import { useQuery } from "@tanstack/react-query";

const PetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const petId = id || "";

  const { 
    data: pet,
    isLoading: isPetLoading,
    error: petError,
    refetch: refetchPet 
  } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => getPetById(petId),
    enabled: !!petId && isAuthenticated,
  });

  const {
    data: visits = [],
    isLoading: isVisitsLoading,
    refetch: refetchVisits
  } = useQuery({
    queryKey: ['petVisits', petId],
    queryFn: () => getVisitsByPetId(petId),
    enabled: !!petId && isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby przeglądać dane zwierząt",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  useEffect(() => {
    if (petError) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać danych zwierzęcia",
        variant: "destructive"
      });
    }
  }, [petError, toast]);
  
  const handlePetUpdated = (updatedPet: Pet) => {
    refetchPet();
    toast({
      title: "Dane zaktualizowane",
      description: `Dane ${updatedPet.name} zostały pomyślnie zaktualizowane`,
    });
  };

  const handleVisitUpdated = (updatedVisit: Visit) => {
    refetchVisits();
  };

  if (isPetLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!pet) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Nie znaleziono zwierzęcia</h2>
            <p className="text-muted-foreground mt-2">Zwierzę o podanym ID nie istnieje</p>
            <Button asChild className="mt-4">
              <Link to="/pets">Wróć do listy zwierząt</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to={`/clients/${pet.clientId}`}><ArrowLeft className="mr-2 h-4 w-4" /> Powrót do klienta</Link>
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
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-card rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Podstawowe informacje</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gatunek:</span>
                      <span className="font-medium">{pet.species}</span>
                    </div>
                    {pet.breed && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rasa:</span>
                        <span className="font-medium">{pet.breed}</span>
                      </div>
                    )}
                    {pet.age && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wiek:</span>
                        <span className="font-medium">{pet.age} lat</span>
                      </div>
                    )}
                    {pet.sex && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Płeć:</span>
                        <span className="font-medium">{pet.sex === 'male' ? 'Samiec' : 'Samica'}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kastracja/Sterylizacja:</span>
                      <span className="font-medium">{pet.neutered ? 'Tak' : 'Nie'}</span>
                    </div>
                    {pet.weight && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Waga:</span>
                        <span className="font-medium">{pet.weight} kg</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {(pet.medicalHistory || pet.allergies || pet.dietaryRestrictions) && (
                  <div className="bg-card rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Informacje medyczne</h3>
                    {pet.medicalHistory && (
                      <div className="mb-3">
                        <div className="text-muted-foreground mb-1">Historia medyczna:</div>
                        <div>{pet.medicalHistory}</div>
                      </div>
                    )}
                    {pet.allergies && (
                      <div className="mb-3">
                        <div className="text-muted-foreground mb-1">Alergie:</div>
                        <div>{pet.allergies}</div>
                      </div>
                    )}
                    {pet.dietaryRestrictions && (
                      <div>
                        <div className="text-muted-foreground mb-1">Ograniczenia żywieniowe:</div>
                        <div>{pet.dietaryRestrictions}</div>
                      </div>
                    )}
                  </div>
                )}
                
                {pet.behavioralNotes && (
                  <div className="bg-card rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Zachowanie</h3>
                    <div>{pet.behavioralNotes}</div>
                  </div>
                )}
              </div>
            </div>
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
            <PetCarePrograms petId={petId} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PetProfile;
