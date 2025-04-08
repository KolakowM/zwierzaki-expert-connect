
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthProvider";
import { Client, Pet, Visit } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClientById, deleteClient } from "@/services/clientService";
import { getPets } from "@/services/petService";
import { getVisits } from "@/services/visitService";

// Import our components
import ClientHeader from "@/components/clients/ClientHeader";
import ClientContactInfo from "@/components/clients/ClientContactInfo";
import ClientNotes from "@/components/clients/ClientNotes";
import ClientOverviewTab from "@/components/clients/tabs/ClientOverviewTab";
import ClientPetsTab from "@/components/clients/tabs/ClientPetsTab";
import ClientVisitsTab from "@/components/clients/tabs/ClientVisitsTab";
import ClientDocumentsTab from "@/components/clients/tabs/ClientDocumentsTab";
import ClientNotesTab from "@/components/clients/tabs/ClientNotesTab";

const ClientDetails = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby przeglądać szczegóły klienta",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Fetch client details using React Query
  const { 
    data: client, 
    isLoading: isLoadingClient,
    isError: isClientError
  } = useQuery({
    queryKey: ['client', id],
    queryFn: () => id ? getClientById(id) : null,
    enabled: !!id && isAuthenticated,
  });

  // Fetch client's pets using React Query
  const { 
    data: allPets = [], 
    isLoading: isLoadingPets,
    refetch: refetchPets
  } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
    enabled: isAuthenticated,
  });

  // Fetch client's visits using React Query
  const { 
    data: allVisits = [], 
    isLoading: isLoadingVisits,
    refetch: refetchVisits
  } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits,
    enabled: isAuthenticated,
  });

  // Filter pets and visits for this client
  const pets = allPets.filter(p => p.clientId === id);
  const visits = allVisits.filter(v => v.clientId === id);

  // Show error if client not found
  useEffect(() => {
    if (isClientError) {
      toast({
        title: "Nie znaleziono klienta",
        description: "Klient o podanym identyfikatorze nie istnieje lub wystąpił błąd",
        variant: "destructive"
      });
      navigate("/clients");
    }
  }, [isClientError, navigate, toast]);

  const handlePetSaved = (newPet: Pet) => {
    // Refresh the pets data
    refetchPets();
    toast({
      title: "Zwierzę zapisane pomyślnie",
      description: `${newPet.name} został pomyślnie zapisany`
    });
  };

  const handleClientUpdated = (updatedClient: Client) => {
    // Refresh client data
    queryClient.invalidateQueries({ queryKey: ['client', id] });
    toast({
      title: "Dane klienta zaktualizowane",
      description: "Zmiany zostały zapisane pomyślnie"
    });
  };

  const handleVisitAdded = (visit: Visit) => {
    // Refresh visits data
    refetchVisits();
    toast({
      title: "Wizyta dodana pomyślnie",
      description: "Nowa wizyta została zapisana"
    });
  };

  const handleDeleteClient = async () => {
    try {
      if (!client?.id) return;
      
      await deleteClient(client.id);
      
      toast({
        title: "Klient usunięty",
        description: `Klient ${client.firstName} ${client.lastName} oraz wszystkie powiązane dane zostały pomyślnie usunięte`
      });
      
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Błąd podczas usuwania klienta",
        description: "Wystąpił błąd podczas usuwania klienta. Spróbuj ponownie później.",
        variant: "destructive"
      });
    }
  };

  if (isLoadingClient) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-muted/50 animate-pulse"></div>
            <div className="h-8 w-48 bg-muted/50 animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-32 bg-muted/50 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/50 rounded"></div>
                    <div className="h-4 w-3/4 bg-muted/50 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!client) {
    return null;
  }

  // Calculate total entities that would be deleted with this client
  const totalPets = pets.length;
  const totalVisits = visits.length;
  let deleteWarning = '';
  
  if (totalPets > 0 || totalVisits > 0) {
    deleteWarning = `Wraz z klientem zostaną również usunięte:
    ${totalPets > 0 ? `\n- ${totalPets} zwierząt` : ''}
    ${totalVisits > 0 ? `\n- ${totalVisits} wizyt` : ''}`;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Client header with actions */}
        <ClientHeader 
          client={client}
          onClientUpdated={handleClientUpdated}
          onDeleteClient={handleDeleteClient}
          deleteWarning={deleteWarning}
        />

        {/* Client info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ClientContactInfo client={client} />
          <ClientNotes client={client} />
        </div>

        {/* Tabs for different client data sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Przegląd</TabsTrigger>
            <TabsTrigger value="pets">Zwierzęta ({pets.length})</TabsTrigger>
            <TabsTrigger value="visits">Historia wizyt ({visits.length})</TabsTrigger>
            <TabsTrigger value="notes">Notatki</TabsTrigger>
            <TabsTrigger value="documents">Dokumenty</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <ClientOverviewTab
              client={client}
              pets={pets}
              visits={visits}
              onPetSaved={handlePetSaved}
              onVisitAdded={handleVisitAdded}
            />
          </TabsContent>
          
          <TabsContent value="pets" className="space-y-4">
            <ClientPetsTab 
              client={client}
              pets={pets}
              onPetSaved={handlePetSaved}
            />
          </TabsContent>
          
          <TabsContent value="visits" className="space-y-4">
            <ClientVisitsTab
              client={client}
              pets={pets}
              visits={visits}
              onVisitAdded={handleVisitAdded}
            />
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            <ClientNotesTab client={client} />
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <ClientDocumentsTab client={client} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ClientDetails;
