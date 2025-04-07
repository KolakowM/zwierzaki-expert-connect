
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Calendar } from "lucide-react";
import { Client, Pet, Visit } from "@/types";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";
import ResponsiveVisitForm from "@/components/visits/ResponsiveVisitForm";

interface ClientOverviewTabProps {
  client: Client;
  pets: Pet[];
  visits: Visit[];
  onPetSaved: (pet: Pet) => void;
  onVisitAdded: (visit: Visit) => void;
}

const ClientOverviewTab = ({
  client,
  pets,
  visits,
  onPetSaved,
  onVisitAdded,
}: ClientOverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Zwierzęta klienta</CardTitle>
          <CardDescription>
            Lista zwierząt zarejestrowanych dla tego klienta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pets.length > 0 ? (
            <div className="space-y-2">
              {pets.map(pet => (
                <div key={pet.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center">
                    <PawPrint className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pet.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.species} • {pet.breed || "Nieznana rasa"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/pets/${pet.id}`}>Szczegóły</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <PawPrint className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Brak zarejestrowanych zwierząt dla tego klienta
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {client.id && (
            <ResponsivePetForm 
              clientId={client.id}
              buttonText="Dodaj zwierzę"
              buttonSize="sm"
              onPetSaved={onPetSaved}
            />
          )}
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ostatnie wizyty</CardTitle>
          <CardDescription>
            Najnowsze wizyty i konsultacje
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visits.length > 0 ? (
            <div className="space-y-2">
              {visits.slice(0, 3).map(visit => {
                const pet = pets.find(p => p.id === visit.petId);
                return (
                  <div key={visit.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{new Date(visit.date).toLocaleDateString('pl-PL')}</p>
                      <p className="text-sm text-muted-foreground">
                        {visit.type} • {pet?.name || "Nieznane zwierzę"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Szczegóły
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Calendar className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Brak zarejestrowanych wizyt dla tego klienta
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {client.id && pets.length > 0 && (
            <ResponsiveVisitForm
              petId={pets[0].id}
              clientId={client.id}
              buttonText="Dodaj wizytę"
              buttonSize="sm"
              onVisitSaved={onVisitAdded}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientOverviewTab;
