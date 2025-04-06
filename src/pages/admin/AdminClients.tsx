
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
import { 
  Search, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  Eye,
  UserPlus
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients, deleteClient, getRelatedEntitiesCount } from "@/services/clientService";
import { Link } from "react-router-dom";
import ResponsiveClientForm from "@/components/clients/ResponsiveClientForm";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";

const AdminClients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  const handleClientSaved = (client: Omit<Client, 'id' | 'createdAt'>) => {
    // Invalidate clients query to refresh data after adding a new client
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    
    toast({
      title: "Klient dodany pomyślnie",
      description: `${client.firstName} ${client.lastName} został dodany do bazy klientów`
    });
  };

  const handleDeleteClient = async (client: Client) => {
    try {
      // Pobierz liczbę powiązanych encji przed usunięciem
      const relatedEntities = await getRelatedEntitiesCount(client.id);
      
      if (
        relatedEntities.petsCount > 0 || 
        relatedEntities.visitsCount > 0 || 
        relatedEntities.careProgramsCount > 0
      ) {
        // Pokaż szczegółowe ostrzeżenie
        const deleteMessage = `
          Wraz z klientem zostaną również usunięte:
          ${relatedEntities.petsCount > 0 ? `\n- ${relatedEntities.petsCount} zwierząt` : ''}
          ${relatedEntities.visitsCount > 0 ? `\n- ${relatedEntities.visitsCount} wizyt` : ''}
          ${relatedEntities.careProgramsCount > 0 ? `\n- ${relatedEntities.careProgramsCount} programów opieki` : ''}
        `;
        
        // Usuwanie z ostrzeżeniem o powiązanych danych
        return {
          title: `Usuń klienta: ${client.firstName} ${client.lastName}`,
          description: "Czy na pewno chcesz usunąć tego klienta?",
          additionalWarning: deleteMessage.trim(),
          onConfirm: async () => {
            await deleteClient(client.id);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            
            toast({
              title: "Klient usunięty",
              description: `Klient ${client.firstName} ${client.lastName} oraz wszystkie powiązane dane zostały pomyślnie usunięte`
            });
          }
        };
      } else {
        // Standardowe usuwanie bez ostrzeżeń
        return {
          title: `Usuń klienta: ${client.firstName} ${client.lastName}`,
          description: "Czy na pewno chcesz usunąć tego klienta?",
          onConfirm: async () => {
            await deleteClient(client.id);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            
            toast({
              title: "Klient usunięty",
              description: `Klient ${client.firstName} ${client.lastName} został pomyślnie usunięty`
            });
          }
        };
      }
    } catch (error) {
      console.error("Error preparing client deletion:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas przygotowywania usuwania klienta. Spróbuj ponownie.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Filter and sort clients
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
    });

  return (
    <>
      <AdminHeader 
        title="Zarządzanie Klientami" 
        description="Przeglądaj, dodawaj i zarządzaj klientami platformy"
      />
      
      <Card className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj klientów..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ResponsiveClientForm
            buttonText="Dodaj Klienta"
            buttonVariant="default"
            onClientSaved={handleClientSaved}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Dodaj Klienta
          </ResponsiveClientForm>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[200px] cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Imię i Nazwisko
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("phone")}
                >
                  <div className="flex items-center">
                    Telefon
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("city")}
                >
                  <div className="flex items-center">
                    Miasto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Data Utworzenia
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
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.city || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/clients/${client.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <ResponsiveClientForm
                            buttonText=""
                            buttonVariant="ghost"
                            buttonSize="icon"
                            defaultValues={client}
                            title={`Edytuj: ${client.firstName} ${client.lastName}`}
                            onClientSaved={() => {
                              queryClient.invalidateQueries({ queryKey: ['clients'] });
                              queryClient.invalidateQueries({ queryKey: ['client', client.id] });
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </ResponsiveClientForm>
                        </Button>
                        <DeleteClientButton client={client} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nie znaleziono klientów
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

// Wydzielony komponent do usuwania klienta z obsługą asynchronicznej konfiguracji dialogu potwierdzenia
const DeleteClientButton = ({ client }: { client: Client }) => {
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
      const props = await handleDeleteClient(client);
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

  const handleDeleteClient = async (client: Client) => {
    try {
      // Pobierz liczbę powiązanych encji przed usunięciem
      const relatedEntities = await getRelatedEntitiesCount(client.id);
      
      if (
        relatedEntities.petsCount > 0 || 
        relatedEntities.visitsCount > 0 || 
        relatedEntities.careProgramsCount > 0
      ) {
        // Pokaż szczegółowe ostrzeżenie
        const deleteMessage = `
          Wraz z klientem zostaną również usunięte:
          ${relatedEntities.petsCount > 0 ? `\n- ${relatedEntities.petsCount} zwierząt` : ''}
          ${relatedEntities.visitsCount > 0 ? `\n- ${relatedEntities.visitsCount} wizyt` : ''}
          ${relatedEntities.careProgramsCount > 0 ? `\n- ${relatedEntities.careProgramsCount} programów opieki` : ''}
        `;
        
        // Usuwanie z ostrzeżeniem o powiązanych danych
        return {
          title: `Usuń klienta: ${client.firstName} ${client.lastName}`,
          description: "Czy na pewno chcesz usunąć tego klienta?",
          additionalWarning: deleteMessage.trim(),
          onConfirm: async () => {
            await deleteClient(client.id);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            
            toast({
              title: "Klient usunięty",
              description: `Klient ${client.firstName} ${client.lastName} oraz wszystkie powiązane dane zostały pomyślnie usunięte`
            });
          }
        };
      } else {
        // Standardowe usuwanie bez ostrzeżeń
        return {
          title: `Usuń klienta: ${client.firstName} ${client.lastName}`,
          description: "Czy na pewno chcesz usunąć tego klienta?",
          onConfirm: async () => {
            await deleteClient(client.id);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            
            toast({
              title: "Klient usunięty",
              description: `Klient ${client.firstName} ${client.lastName} został pomyślnie usunięty`
            });
          }
        };
      }
    } catch (error) {
      console.error("Error preparing client deletion:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas przygotowywania usuwania klienta. Spróbuj ponownie.",
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

export default AdminClients;
