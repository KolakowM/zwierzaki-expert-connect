
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Pet, Client } from "@/types";
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
import { Search, PawPrint, Filter } from "lucide-react";
import { getPets } from "@/services/petService";
import { getClients } from "@/services/clientService";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";

const Pets = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");

  // Fetch pets using React Query
  const { data: pets = [], isLoading: petsLoading, error: petsError, refetch: refetchPets } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });

  // Fetch clients for pet owners info
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby przeglądać zwierzęta",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  // Handle errors in fetching pets
  useEffect(() => {
    if (petsError) {
      toast({
        title: "Błąd podczas pobierania zwierząt",
        description: "Nie udało się pobrać listy zwierząt",
        variant: "destructive"
      });
    }
  }, [petsError, toast]);

  const handlePetSaved = (newPet: Pet) => {
    refetchPets(); // Refresh the pets list after adding/updating a pet
    toast({
      title: "Zwierzę zapisane",
      description: `Zwierzę ${newPet.name} zostało pomyślnie zapisane`,
    });
  };

  // Get unique species for filter
  const uniqueSpecies = Array.from(new Set(pets.map(pet => pet.species)));

  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Nieznany";
  };

  // Apply filters
  const filteredPets = pets.filter(pet => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      getClientName(pet.clientId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecies = speciesFilter === "all" || pet.species === speciesFilter;
    
    return matchesSearch && matchesSpecies;
  });

  // Default client for new pet form
  const defaultClientForNewPet = clients.length > 0 ? clients[0].id : undefined;

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <PawPrint className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Zwierzęta</h1>
          </div>
          {defaultClientForNewPet && (
            <ResponsivePetForm 
              clientId={defaultClientForNewPet}
              buttonText="Dodaj zwierzę"
              onPetSaved={handlePetSaved}
            />
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtruj i wyszukaj zwierzęta</CardTitle>
            <CardDescription>
              Znajdź zwierzęta po imieniu, rasie, właścicielu lub gatunku
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Szukaj zwierząt..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-[200px]">
                <Select
                  value={speciesFilter}
                  onValueChange={setSpeciesFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Gatunek" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie gatunki</SelectItem>
                    {uniqueSpecies.map(species => (
                      <SelectItem key={species} value={species}>
                        {species.charAt(0).toUpperCase() + species.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista zwierząt ({filteredPets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {petsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredPets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imię</TableHead>
                    <TableHead>Gatunek</TableHead>
                    <TableHead>Rasa</TableHead>
                    <TableHead>Właściciel</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPets.map((pet) => (
                    <TableRow key={pet.id}>
                      <TableCell className="font-medium">
                        <Link to={`/pets/${pet.id}`} className="hover:underline">
                          {pet.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{pet.breed || '—'}</TableCell>
                      <TableCell>
                        <Link to={`/clients/${pet.clientId}`} className="hover:underline">
                          {getClientName(pet.clientId)}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/pets/${pet.id}`}>Szczegóły</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <PawPrint className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-2 text-lg font-medium">Brak zwierząt</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm || speciesFilter !== "all" 
                    ? "Nie znaleziono zwierząt spełniających kryteria wyszukiwania" 
                    : "Nie masz jeszcze żadnych zwierząt. Dodaj pierwsze zwierzę."}
                </p>
                {!searchTerm && speciesFilter === "all" && defaultClientForNewPet && (
                  <div className="mt-4">
                    <ResponsivePetForm 
                      clientId={defaultClientForNewPet}
                      buttonText="Dodaj pierwsze zwierzę"
                      onPetSaved={handlePetSaved}
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

export default Pets;
