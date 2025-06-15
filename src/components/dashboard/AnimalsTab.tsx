
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Pet, Client } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, PawPrint, Mail, Phone } from "lucide-react";
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

const AnimalsTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");

  // Fetch pets using React Query
  const { data: pets = [], isLoading: petsLoading, error: petsError } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });

  // Fetch clients for pet owners info
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

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

  // Get unique species for filter
  const uniqueSpecies = Array.from(new Set(pets.map(pet => pet.species)));

  // Get client by ID
  const getClient = (clientId: string): Client | undefined => {
    return clients.find(c => c.id === clientId);
  };

  // Apply filters
  const filteredPets = pets.filter(pet => {
    const client = getClient(pet.clientId);
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client?.phone?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecies = speciesFilter === "all" || pet.species === speciesFilter;
    
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zarządzanie zwierzętami</CardTitle>
          <CardDescription>
            Wyszukaj i przeglądaj wszystkie zwierzęta swoich klientów
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista zwierząt ({filteredPets.length})</CardTitle>
              <CardDescription>
                Wszystkie zwierzęta zarejestrowane w systemie
              </CardDescription>
            </div>
            <Link to="/pets" className="text-sm text-primary hover:underline">
              Zobacz pełną listę
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {petsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredPets.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imię</TableHead>
                    <TableHead>Gatunek</TableHead>
                    <TableHead className="hidden md:table-cell">Rasa</TableHead>
                    <TableHead>Właściciel</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Telefon</TableHead>
                    <TableHead className="text-right">Szczegóły</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPets.map((pet) => {
                    const owner = getClient(pet.clientId);
                    return (
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
                        <TableCell className="hidden md:table-cell">{pet.breed || '—'}</TableCell>
                        <TableCell>
                          {owner ? (
                            <Link to={`/clients/${owner.id}`} className="hover:underline">
                              {owner.firstName} {owner.lastName}
                            </Link>
                          ) : '—'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {owner?.email && (
                            <div className="flex items-center">
                              <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <a href={`mailto:${owner.email}`} className="hover:underline text-sm">
                                {owner.email}
                              </a>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {owner?.phone && (
                            <div className="flex items-center">
                              <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <a href={`tel:${owner.phone}`} className="hover:underline text-sm">
                                {owner.phone}
                              </a>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/pets/${pet.id}`} className="text-sm font-medium text-primary hover:underline">
                            Zobacz profil
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <PawPrint className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">Brak zwierząt</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm || speciesFilter !== "all" 
                  ? "Nie znaleziono zwierząt spełniających kryteria wyszukiwania" 
                  : "Nie masz jeszcze żadnych zwierząt."}
              </p>
              {!searchTerm && speciesFilter === "all" && (
                <Link to="/pets" className="mt-4 inline-block text-sm text-primary hover:underline">
                  Przejdź do zarządzania zwierzętami
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalsTab;
