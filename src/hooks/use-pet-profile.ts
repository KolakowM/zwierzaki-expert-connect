import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPetById, deletePet } from "@/services/petService";
import { getClientById } from "@/services/clientService";
import { getVisitsByPetId } from "@/services/visitService";
import { getCareProgramsByPetId } from "@/services/careProgramService";
import type { Pet, Visit, CareProgram, Client } from "@/types";

export const usePetProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const petId = id || "";

  // Use caching for pet data
  const { 
    data: pet,
    isLoading: isPetLoading,
    error: petError,
    refetch: refetchPet 
  } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => getPetById(petId),
    enabled: !!petId && isAuthenticated,
    staleTime: 60000, // Cache data for 1 minute
  });

  // Use caching for owner data
  const { 
    data: owner,
    isLoading: isOwnerLoading 
  } = useQuery({
    queryKey: ['client', pet?.clientId],
    queryFn: () => pet?.clientId ? getClientById(pet.clientId) : null,
    enabled: !!pet?.clientId && isAuthenticated,
    staleTime: 60000, // Cache data for 1 minute
  });

  // Use caching for visits data
  const {
    data: visits = [],
    isLoading: isVisitsLoading,
    refetch: refetchVisits
  } = useQuery({
    queryKey: ['visits', petId],
    queryFn: () => getVisitsByPetId(petId),
    enabled: !!petId && isAuthenticated,
    staleTime: 60000, // Cache data for 1 minute
  });

  // Use caching for care programs data
  const { 
    data: carePrograms = [],
    isLoading: isCareLoading
  } = useQuery({
    queryKey: ['carePrograms', petId],
    queryFn: () => getCareProgramsByPetId(petId),
    enabled: !!petId && isAuthenticated,
    staleTime: 60000, // Cache data for 1 minute
  });

  const isLoading = isPetLoading || isOwnerLoading || isVisitsLoading || isCareLoading;

  // We'll only show the authentication error message once, not trigger navigation
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby przeglądać dane zwierząt",
        variant: "destructive"
      });
      // Note: Navigation will be handled by ProtectedRoute, not here
    }
  }, [isAuthenticated, isLoading, toast]);

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
    queryClient.invalidateQueries({ queryKey: ['pet', petId] });
    toast({
      title: "Dane zaktualizowane",
      description: `Dane ${updatedPet.name} zostały pomyślnie zaktualizowane`,
    });
  };

  const handleVisitAdded = (visit: Visit) => {
    queryClient.invalidateQueries({ queryKey: ['visits', petId] });
    toast({
      title: "Wizyta dodana pomyślnie",
      description: "Nowa wizyta została zapisana",
    });
  };

  const handleVisitUpdated = (updatedVisit: Visit) => {
    queryClient.invalidateQueries({ queryKey: ['visits', petId] });
    toast({
      title: "Wizyta zaktualizowana",
      description: "Dane wizyty zostały zaktualizowane",
    });
  };

  const handleCareProgramAdded = (careProgram: CareProgram) => {
    queryClient.invalidateQueries({ queryKey: ['carePrograms', petId] });
    toast({
      title: "Plan opieki utworzony pomyślnie",
      description: "Nowy plan opieki został zapisany",
    });
  };

  const handleDeletePet = async () => {
    try {
      if (!pet?.id) return;
      
      await deletePet(pet.id);
      
      toast({
        title: "Zwierzę usunięte",
        description: `${pet.name} oraz wszystkie powiązane dane zostały pomyślnie usunięte`
      });
      
      if (pet.clientId) {
        navigate(`/clients/${pet.clientId}`);
      } else {
        navigate("/clients");
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast({
        title: "Błąd podczas usuwania zwierzęcia",
        description: "Wystąpił błąd podczas usuwania zwierzęcia. Spróbuj ponownie później.",
        variant: "destructive"
      });
    }
  };

  return {
    pet,
    owner,
    visits,
    carePrograms,
    isPetLoading,
    isVisitsLoading,
    isLoading,
    activeTab,
    setActiveTab,
    handlePetUpdated,
    handleVisitUpdated,
    handleVisitAdded,
    handleCareProgramAdded,
    handleDeletePet
  };
};
