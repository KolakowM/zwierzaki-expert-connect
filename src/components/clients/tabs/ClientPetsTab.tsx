
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Client, Pet } from "@/types";
import SmartActionButton from "@/components/subscription/SmartActionButton";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";

interface ClientPetsTabProps {
  client: Client;
  pets: Pet[];
  onPetSaved: (pet: Pet) => void;
}

const ClientPetsTab = ({
  client,
  pets,
  onPetSaved,
}: ClientPetsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Lista zwierząt</CardTitle>
          <CardDescription>
            Wszystkie zwierzęta należące do tego klienta
          </CardDescription>
        </div>
        {client.id && (
          <ResponsivePetForm 
            clientId={client.id}
            buttonText="Dodaj zwierzę"
            onPetSaved={onPetSaved}
          />
        )}
      </CardHeader>
      <CardContent>
        {pets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imię</TableHead>
                <TableHead>Gatunek</TableHead>
                <TableHead>Rasa</TableHead>
                <TableHead>Wiek</TableHead>
                <TableHead>Płeć</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">
                    <Link to={`/pets/${pet.id}`} className="hover:underline">
                      {pet.name}
                    </Link>
                  </TableCell>
                  <TableCell>{pet.species}</TableCell>
                  <TableCell>{pet.breed || '—'}</TableCell>
                  <TableCell>{pet.age ? `${pet.age} lat` : '—'}</TableCell>
                  <TableCell>{pet.sex || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <SmartActionButton
                        actionType="pets"
                        onAction={() => {}}
                        variant="ghost"
                        size="sm"
                        showWarnings={false}
                      >
                        <Link to={`/pets/${pet.id}`}>Szczegóły</Link>
                      </SmartActionButton>
                    </div>
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
              Ten klient nie ma jeszcze zarejestrowanych zwierząt
            </p>
            {client.id && (
              <div className="mt-4">
                <ResponsivePetForm 
                  clientId={client.id}
                  buttonText="Dodaj pierwsze zwierzę"
                  onPetSaved={onPetSaved}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientPetsTab;
