
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  Calendar,
  CalendarPlus,
  CheckCircle,
  Bookmark
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVisits } from "@/services/visitService";
import { getClients } from "@/services/clientService";
import { getPets } from "@/services/petService";

const AdminVisits = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
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
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <AdminHeader 
        title="Zarządzanie Wizytami" 
        description="Przeglądaj, dodawaj i zarządzaj wizytami"
      />
      
      <Card className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj wizyt..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto">
            <CalendarPlus className="mr-2 h-4 w-4" /> Dodaj Wizytę
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Rodzaj Wizyty
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("pet")}
                >
                  <div className="flex items-center">
                    Zwierzę
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("client")}
                >
                  <div className="flex items-center">
                    Właściciel
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                >
                  Kontynuacja
                </TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(visit.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{visit.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{getPetName(visit.petId)}</TableCell>
                    <TableCell className="hidden md:table-cell">{getClientName(visit.clientId)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {visit.followUpNeeded ? (
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          {visit.followUpDate ? formatDate(visit.followUpDate) : "Tak"}
                        </div>
                      ) : "Nie"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nie znaleziono wizyt
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default AdminVisits;
