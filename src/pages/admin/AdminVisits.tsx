
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVisits, deleteVisit } from "@/services/visitService";
import { getClients } from "@/services/clientService";
import { getPets } from "@/services/petService";
import { useToast } from "@/hooks/use-toast";
import VisitSearchBar from "@/components/admin/visits/VisitSearchBar";
import VisitsTable from "@/components/admin/visits/VisitsTable";

const AdminVisits = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: visits = [], isLoading: visitsLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits,
  });
  
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });
  
  const isLoading = visitsLoading || clientsLoading || petsLoading;
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleDeleteVisit = async (id: string, type: string) => {
    if (confirm(`Czy na pewno chcesz usunąć wizytę "${type}"?`)) {
      try {
        await deleteVisit(id);
        queryClient.invalidateQueries({ queryKey: ['visits'] });
        
        toast({
          title: "Wizyta usunięta",
          description: `Wizyta została pomyślnie usunięta`
        });
      } catch (error) {
        console.error("Error deleting visit:", error);
        toast({
          title: "Błąd podczas usuwania",
          description: "Nie udało się usunąć wizyty. Spróbuj ponownie.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Helper function to get client name from clientId
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Nieznany";
  };
  
  // Helper function to get pet name from petId
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : "Nieznane";
  };
  
  // Format date function
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Filter and sort visits
  const filteredVisits = visits
    .filter(visit => {
      const clientName = getClientName(visit.clientId).toLowerCase();
      const petName = getPetName(visit.petId).toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      
      return clientName.includes(searchLower) ||
        petName.includes(searchLower) ||
        visit.type.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valueA, valueB;
      
      if (sortBy === "date") {
        valueA = new Date(typeof a.date === 'string' ? a.date : a.date).getTime();
        valueB = new Date(typeof b.date === 'string' ? b.date : b.date).getTime();
      } else if (sortBy === "pet") {
        valueA = getPetName(a.petId).toLowerCase();
        valueB = getPetName(b.petId).toLowerCase();
      } else if (sortBy === "client") {
        valueA = getClientName(a.clientId).toLowerCase();
        valueB = getClientName(b.clientId).toLowerCase();
      } else {
        valueA = a[sortBy as keyof typeof a] || '';
        valueB = b[sortBy as keyof typeof b] || '';
        
        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
        }
        if (typeof valueB === "string") {
          valueB = valueB.toLowerCase();
        }
      }
      
      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

  return (
    <>
      <AdminHeader 
        title="Zarządzanie Wizytami" 
        description="Przeglądaj, dodawaj i zarządzaj wizytami"
      />
      
      <Card className="mt-6">
        <VisitSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <VisitsTable 
          visits={filteredVisits}
          isLoading={isLoading}
          getPetName={getPetName}
          getClientName={getClientName}
          formatDate={formatDate}
          handleSort={handleSort}
          handleDeleteVisit={handleDeleteVisit}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Card>
    </>
  );
};

export default AdminVisits;
