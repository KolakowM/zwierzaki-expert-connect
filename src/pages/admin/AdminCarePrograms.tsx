
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
  ClipboardList,
  Calendar,
  FileText,
  PlusCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPets } from "@/services/petService";
import CareProgramDetailsDialog from "@/components/care-programs/CareProgramDetailsDialog";

// Mock care programs data for demonstration until we have a real API
const mockCarePrograms = [
  {
    id: "1",
    petId: "1", // This should match an actual pet ID in your system
    name: "Plan odchudzania",
    goal: "Redukcja wagi o 20%",
    startDate: "2023-04-01",
    endDate: "2023-10-01",
    status: "aktywny",
    createdAt: "2023-03-25"
  },
  {
    id: "2",
    petId: "2",
    name: "Rehabilitacja po złamaniu",
    goal: "Przywrócenie sprawności kończyny",
    startDate: "2023-03-15",
    endDate: "2023-06-15",
    status: "aktywny",
    createdAt: "2023-03-10"
  },
  {
    id: "3",
    petId: "3",
    name: "Program odżywiania",
    goal: "Wzmocnienie systemu odpornościowego",
    startDate: "2023-02-01",
    endDate: "2023-08-01",
    status: "aktywny",
    createdAt: "2023-01-28"
  },
  {
    id: "4",
    petId: "4",
    name: "Terapia alergiczna",
    goal: "Zidentyfikowanie i wyeliminowanie alergenów",
    startDate: "2023-01-10",
    endDate: "2023-04-10",
    status: "zakończony",
    createdAt: "2023-01-05"
  },
  {
    id: "5",
    petId: "5",
    name: "Program szczepień",
    goal: "Kompletny program szczepień dla szczeniaka",
    startDate: "2023-05-01",
    endDate: "2024-05-01",
    status: "aktywny",
    createdAt: "2023-04-25"
  },
];

const AdminCarePrograms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });
  
  const isLoading = petsLoading;
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Helper function to get pet name from petId
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : "Nieznane";
  };
  
  // Filter and sort care programs
  const filteredPrograms = mockCarePrograms
    .filter(program => {
      const petName = getPetName(program.petId).toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      
      return petName.includes(searchLower) ||
        program.name.toLowerCase().includes(searchLower) ||
        program.goal.toLowerCase().includes(searchLower) ||
        program.status.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valueA, valueB;
      
      if (sortBy === "startDate" || sortBy === "endDate") {
        valueA = new Date(a[sortBy]).getTime();
        valueB = new Date(b[sortBy]).getTime();
      } else if (sortBy === "pet") {
        valueA = getPetName(a.petId).toLowerCase();
        valueB = getPetName(b.petId).toLowerCase();
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
    
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };
  
  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'aktywny':
        return 'default';
      case 'zakończony':
        return 'secondary';
      case 'anulowany':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <AdminHeader 
        title="Zarządzanie Programami Opieki" 
        description="Przeglądaj, dodawaj i zarządzaj programami opieki dla pacjentów"
      />
      
      <Card className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj programów opieki..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Dodaj Program
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Nazwa Programu
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
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center">
                    Data Rozpoczęcia
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("endDate")}
                >
                  <div className="flex items-center">
                    Data Zakończenia
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
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
              ) : filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{program.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{program.goal}</div>
                    </TableCell>
                    <TableCell>{getPetName(program.petId)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(program.startDate)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {program.endDate ? formatDate(program.endDate) : "Bezterminowo"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(program.status)}>
                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <CareProgramDetailsDialog programId={program.id}>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </CareProgramDetailsDialog>
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
                    Nie znaleziono programów opieki
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

export default AdminCarePrograms;
