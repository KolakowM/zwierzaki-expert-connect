
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, Filter } from "lucide-react";
import ResponsiveClientForm from "@/components/clients/ResponsiveClientForm";
import { getClients } from "@/services/clientService";
import { useQuery } from "@tanstack/react-query";

const Clients = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch clients using React Query
  const { 
    data: clients = [], 
    isLoading: clientsLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    // Don't fetch if not authenticated yet
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby przeglądać klientów",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  // Handle errors in fetching clients
  useEffect(() => {
    if (error) {
      toast({
        title: "Błąd podczas pobierania klientów",
        description: "Nie udało się pobrać listy klientów",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleClientSaved = (newClient: Client) => {
    refetch(); // Refresh the client list after adding a new client
    toast({
      title: "Klient zapisany",
      description: `Klient ${newClient.firstName} ${newClient.lastName} został zapisany`,
    });
  };

  const filteredClients = clients.filter(client => 
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  // Show loading while checking auth
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Klienci</h1>
          </div>
          <ResponsiveClientForm onClientSaved={handleClientSaved} />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtruj i wyszukaj klientów</CardTitle>
            <CardDescription>
              Znajdź klientów po imieniu, nazwisku, emailu lub numerze telefonu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista klientów ({filteredClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <TableHead>Telefon</TableHead>
                    <TableHead>Miasto</TableHead>
                    <TableHead>Data dodania</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <Link to={`/clients/${client.id}`} className="hover:underline">
                          {client.firstName} {client.lastName}
                        </Link>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || '—'}</TableCell>
                      <TableCell>{client.city || '—'}</TableCell>
                      <TableCell>{new Date(client.createdAt).toLocaleDateString('pl-PL')}</TableCell>
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
                <h3 className="mt-2 text-lg font-medium">Brak klientów</h3>
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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Clients;
