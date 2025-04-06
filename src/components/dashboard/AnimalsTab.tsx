
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Pet, Client } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getPets } from "@/services/petService";
import { getClients } from "@/services/clientService";

const AnimalsTab = () => {
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const isLoading = petsLoading || clientsLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zwierzęta</CardTitle>
        <CardDescription>
          Zarządzaj profilami zwierząt swoich klientów
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : pets.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium">Ostatnio dodane zwierzęta</p>
              <Link to="/clients" className="text-sm text-primary hover:underline">
                Zobacz wszystkie
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.slice(0, 6).map(pet => {
                const owner = clients.find(c => c.id === pet.clientId);
                return (
                  <Card key={pet.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <PawPrint className="h-4 w-4 mr-2 text-muted-foreground" />
                          <h3 className="font-medium">{pet.name}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground">{pet.species}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Właściciel: {owner?.firstName} {owner?.lastName}
                      </p>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link to={`/pets/${pet.id}`}>
                          Zobacz profil
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Nie masz jeszcze żadnych zarejestrowanych zwierząt</p>
              <Link to="/clients">
                <Button size="sm" className="mt-4">Dodaj zwierzę</Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimalsTab;
