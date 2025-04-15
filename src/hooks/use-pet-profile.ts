
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getPetById } from "@/services/petService";
import { getVisitsByPetId } from "@/services/visitService";
import type { Pet, Visit } from "@/types";

export const usePetProfile = () => {
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

  return {
    pet,
    visits,
    isPetLoading,
    isVisitsLoading,
    activeTab,
    setActiveTab,
    handlePetUpdated,
    handleVisitUpdated
  };
};
