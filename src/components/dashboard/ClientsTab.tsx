
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ResponsiveClientForm from "@/components/clients/ResponsiveClientForm";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Client } from "@/types";
import { getClients, createClient } from "@/services/clientService";

const ClientsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch clients using React Query
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const handleClientSaved = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      await createClient(client);
      // Invalidate clients query to refresh data
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      
      toast({
        title: "Klient dodany pomyślnie",
        description: `${client.firstName} ${client.lastName} został dodany do bazy klientów`
      });
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: "Błąd podczas dodawania klienta",
        description: "Nie udało się zapisać danych klienta. Spróbuj ponownie.",
        variant: "destructive"
      });
    }
  };

  const filteredClients = clients.filter(client => 
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Baza klientów
              </CardTitle>
              <CardDescription>
                Zarządzaj swoimi klientami ({clients.length} klientów)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <ResponsiveClientForm 
                buttonText="Dodaj klienta" 
                onClientSaved={handleClientSaved}
              />
              <Button variant="outline" asChild>
                <Link to="/clients">
                  Pełna lista
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Szukaj klientów..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtry
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredClients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imię i nazwisko</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Telefon</TableHead>
                  <TableHead className="hidden lg:table-cell">Miasto</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.slice(0, 10).map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <Link to={`/clients/${client.id}`} className="hover:underline">
                        {client.firstName} {client.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.phone || '—'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{client.city || '—'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/clients/${client.id}`}>Szczegóły</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">
                {searchTerm ? "Brak wyników" : "Brak klientów"}
              </h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm 
                  ? "Nie znaleziono klientów spełniających kryteria wyszukiwania" 
                  : "Nie masz jeszcze żadnych klientów. Dodaj pierwszego klienta."}
              </p>
              {!searchTerm && (
                <div className="mt-4">
                  <ResponsiveClientForm 
                    buttonText="Dodaj pierwszego klienta"
                    onClientSaved={handleClientSaved}
                  />
                </div>
              )}
            </div>
          )}

          {filteredClients.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Wyświetlanie 10 z {filteredClients.length} klientów
              </p>
              <Button variant="outline" asChild>
                <Link to="/clients">
                  Zobacz wszystkich klientów
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsTab;
