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
  Eye,
  PlusCircle
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPets, deletePet, getRelatedEntitiesCount } from "@/services/petService";
import { getClients } from "@/services/clientService";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Pet } from "@/types";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";

const AdminPets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });
  
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  
  const isLoading = petsLoading || clientsLoading;
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  const handleDeletePet = async (id: string, name: string) => {
    if (confirm(`Czy na pewno chcesz usunąć zwierzę ${name}?`)) {
      try {
        await deletePet(id);
        queryClient.invalidateQueries({ queryKey: ['pets'] });
        
        toast({
          title: "Zwierzę usunięte",
          description: `Zwierzę ${name} zostało pomyślnie usunięte`
        });
      } catch (error) {
        console.error("Error deleting pet:", error);
        toast({
          title: "Błąd podczas usuwania",
          description: "Nie udało się usunąć zwierzęcia. Spróbuj ponownie.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handlePetSaved = (pet: Pet) => {
    queryClient.invalidateQueries({ queryKey: ['pets'] });
    toast({
      title: "Zwierzę zapisane",
      description: `Zwierzę ${pet.name} zostało pomyślnie zapisane`
    });
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Nieznany";
  };
  
  const filteredPets = pets
    .filter(pet => 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
      getClientName(pet.clientId).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valueA, valueB;
      
      if (sortBy === "owner") {
        valueA = getClientName(a.clientId).toLowerCase();
        valueB = getClientName(b.clientId).toLowerCase();
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
    });

  const defaultClientForNewPet = clients.length > 0 ? clients[0].id : undefined;

  return (
    <>
      <AdminHeader 
        title="Zarządzanie Zwierzętami" 
        description="Przeglądaj, dodawaj i zarządzaj zwierzętami klientów"
      />
      
      <Card className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj zwierząt..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {defaultClientForNewPet && (
            <ResponsivePetForm 
              clientId={defaultClientForNewPet}
              buttonText="Dodaj Zwierzę"
              buttonVariant="default"
              onPetSaved={handlePetSaved}
            >
              <Button variant="default">
                <PlusCircle className="mr-2 h-4 w-4" /> Dodaj Zwierzę
              </Button>
            </ResponsivePetForm>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[150px] cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Imię
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("species")}
                >
                  <div className="flex items-center">
                    Gatunek
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("breed")}
                >
                  <div className="flex items-center">
                    Rasa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("owner")}
                >
                  <div className="flex items-center">
                    Właściciel
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden lg:table-cell"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Data Rejestracji
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
              ) : filteredPets.length > 0 ? (
                filteredPets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell className="font-medium">{pet.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{pet.breed || "-"}</TableCell>
                    <TableCell>{getClientName(pet.clientId)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(pet.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/pets/${pet.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <ResponsivePetForm
                          clientId={pet.clientId}
                          buttonVariant="ghost"
                          buttonSize="icon"
                          defaultValues={pet}
                          isEditing={true}
                          onPetSaved={handlePetSaved}
                        >
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </ResponsivePetForm>
                        <DeletePetButton pet={pet} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nie znaleziono zwierząt
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

const DeletePetButton = ({ pet }: { pet: Pet }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogProps, setDialogProps] = useState<{
    title: string;
    description: string;
    additionalWarning?: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const prepareDeleteDialog = async () => {
    try {
      setIsLoading(true);
      const props = await handleDeletePet(pet);
      setDialogProps(props);
    } catch (error) {
      console.error("Error preparing delete dialog:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas przygotowywania usunięcia. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePet = async (pet: Pet) => {
    try {
      const relatedEntities = await getRelatedEntitiesCount(pet.id);
      
      if (
        relatedEntities.visitsCount > 0 || 
        relatedEntities.careProgramsCount > 0
      ) {
        const deleteMessage = `
          Wraz ze zwierzęciem zostaną również usunięte:
          ${relatedEntities.visitsCount > 0 ? `\n- ${relatedEntities.visitsCount} wizyt` : ''}
          ${relatedEntities.careProgramsCount > 0 ? `\n- ${relatedEntities.careProgramsCount} programów opieki` : ''}
        `;
        
        return {
          title: `Usuń zwierzę: ${pet.name}`,
          description: "Czy na pewno chcesz usunąć to zwierzę?",
          additionalWarning: deleteMessage.trim(),
          onConfirm: async () => {
            await deletePet(pet.id);
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            
            toast({
              title: "Zwierzę usunięte",
              description: `Zwierzę ${pet.name} oraz wszystkie powiązane dane zostały pomyślnie usunięte`
            });
          }
        };
      } else {
        return {
          title: `Usuń zwierzę: ${pet.name}`,
          description: "Czy na pewno chcesz usunąć to zwierzę?",
          onConfirm: async () => {
            await deletePet(pet.id);
            queryClient.invalidateQueries({ queryKey: ['pets'] });
            
            toast({
              title: "Zwierzę usunięte",
              description: `Zwierzę ${pet.name} zostało pomyślnie usunięte`
            });
          }
        };
      }
    } catch (error) {
      console.error("Error preparing pet deletion:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas przygotowywania usuwania zwierzęcia. Spróbuj ponownie.",
        variant: "destructive"
      });
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
      </Button>
    );
  }

  return (
    dialogProps ? (
      <ConfirmDeleteDialog
        title={dialogProps.title}
        description={dialogProps.description}
        additionalWarning={dialogProps.additionalWarning}
        onConfirm={dialogProps.onConfirm}
        triggerButtonVariant="ghost"
        triggerButtonSize="icon"
      >
        <Button
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ConfirmDeleteDialog>
    ) : (
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-red-500 hover:text-red-700"
        onClick={prepareDeleteDialog}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    )
  );
};

export default AdminPets;
