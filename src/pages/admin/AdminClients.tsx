
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { mapDbClientToClient } from "@/types/client";
import ClientSearchBar from "@/components/admin/clients/ClientSearchBar";
import ClientTable from "@/components/admin/clients/ClientTable";

const AdminClients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const { data: dbClients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  // Map database clients to application clients
  const clients = dbClients.map(mapDbClientToClient);
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Filter and sort clients - now with proper string createdAt for display
  const filteredClients = clients
    .filter(client => 
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone && client.phone.includes(searchQuery))
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valueA, valueB;
      
      if (sortBy === "name") {
        valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortBy === 'createdAt') {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
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
    })
    // Convert to the format expected by ClientTable (with createdAt as string)
    .map(client => ({
      ...client,
      createdAt: client.createdAt.toISOString()
    }));

  return (
    <>
      <AdminHeader 
        title="Zarządzanie Klientami" 
        description="Przeglądaj, dodawaj i zarządzaj klientami platformy"
      />
      
      <Card className="mt-6">
        <ClientSearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <ClientTable 
          clients={filteredClients} 
          isLoading={isLoading} 
          handleSort={handleSort} 
        />
      </Card>
    </>
  );
};

export default AdminClients;
