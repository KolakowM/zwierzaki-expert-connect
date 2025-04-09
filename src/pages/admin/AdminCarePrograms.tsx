
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  ArrowUpDown,
  ClipboardList,
  Calendar,
  FileText,
  PlusCircle,
} from "lucide-react";
import { getPets } from "@/services/petService";
import { getCarePrograms } from "@/services/careProgramService";
import CareProgramDetailsDialog from "@/components/care-programs/CareProgramDetailsDialog";
import ResponsiveCareProgramForm from "@/components/care-programs/ResponsiveCareProgramForm";
import DeleteCareProgramButton from "@/components/admin/care-programs/DeleteCareProgramButton";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CareProgram } from "@/types";

const AdminCarePrograms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Fetch all care programs
  const { data: carePrograms = [], isLoading: programsLoading, refetch: refetchPrograms } = useQuery({
    queryKey: ['carePrograms'],
    queryFn: getCarePrograms,
  });
  
  // Fetch all pets for reference
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });
  
  const isLoading = programsLoading || petsLoading;
  
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
  const filteredPrograms = carePrograms
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
      
      if (sortBy === "startDate") {
        valueA = new Date(a.startDate).getTime();
        valueB = new Date(b.startDate).getTime();
      } else if (sortBy === "endDate") {
        valueA = a.endDate ? new Date(a.endDate).getTime() : Number.MAX_SAFE_INTEGER;
        valueB = b.endDate ? new Date(b.endDate).getTime() : Number.MAX_SAFE_INTEGER;
      } else if (sortBy === "pet") {
        valueA = getPetName(a.petId).toLowerCase();
        valueB = getPetName(b.petId).toLowerCase();
      } else {
        valueA = a[sortBy as keyof CareProgram] || '';
        valueB = b[sortBy as keyof CareProgram] || '';
        
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
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'PPP', { locale: pl });
  };
  
  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'aktywny':
        return 'default';
      case 'zakończony':
        return 'secondary';
      case 'wstrzymany':
        return 'warning';
      case 'planowany':
        return 'success';
      default:
        return 'outline';
    }
  };

  // Handle program deleted callback
  const handleProgramDeleted = () => {
    refetchPrograms();
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
          
          {/* Add new care program - we'll need to pick a pet first */}
          <div className="flex space-x-2 w-full sm:w-auto">
            {pets.length > 0 && (
              <ResponsiveCareProgramForm
                petId={pets[0].id}
                buttonText="Dodaj Program"
                buttonVariant="default"
                onCareProgramSaved={() => refetchPrograms()}
              >
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Dodaj Program
                </Button>
              </ResponsiveCareProgramForm>
            )}
          </div>
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
                        {/* View details */}
                        <CareProgramDetailsDialog programId={program.id}>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </CareProgramDetailsDialog>
                        
                        {/* Edit program */}
                        <ResponsiveCareProgramForm
                          petId={program.petId}
                          isEditing={true}
                          defaultValues={program}
                          onCareProgramSaved={() => refetchPrograms()}
                        >
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </ResponsiveCareProgramForm>
                        
                        {/* Delete program */}
                        <DeleteCareProgramButton 
                          programId={program.id} 
                          programName={program.name}
                          onProgramDeleted={handleProgramDeleted}
                        />
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
