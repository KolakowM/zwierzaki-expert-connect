
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Client, Pet, Visit } from "@/types";
import ResponsiveVisitForm from "@/components/visits/ResponsiveVisitForm";

interface ClientVisitsTabProps {
  client: Client;
  pets: Pet[];
  visits: Visit[];
  onVisitAdded: (visit: Visit) => void;
}

const ClientVisitsTab = ({
  client,
  pets,
  visits,
  onVisitAdded,
}: ClientVisitsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Historia wizyt</CardTitle>
          <CardDescription>
            Wszystkie wizyty i konsultacje tego klienta
          </CardDescription>
        </div>
        {client.id && pets.length > 0 && (
          <ResponsiveVisitForm
            petId={pets[0].id}
            clientId={client.id}
            buttonText="Dodaj wizytę"
            onVisitSaved={onVisitAdded}
          />
        )}
      </CardHeader>
      <CardContent>
        {visits.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Zwierzę</TableHead>
                <TableHead>Notatki</TableHead>
                <TableHead>Kontrola</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit) => {
                const pet = pets.find(p => p.id === visit.petId);
                return (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">
                      {new Date(visit.date).toLocaleDateString('pl-PL')}
                    </TableCell>
                    <TableCell>{visit.type}</TableCell>
                    <TableCell>
                      {pet ? (
                        <Link to={`/pets/${pet.id}`} className="hover:underline">
                          {pet.name}
                        </Link>
                      ) : '—'}
                    </TableCell>
                    <TableCell>{visit.notes ? visit.notes.substring(0, 30) + '...' : '—'}</TableCell>
                    <TableCell>
                      {visit.followUpNeeded ? (
                        <span className="text-amber-600">
                          {new Date(visit.followUpDate || '').toLocaleDateString('pl-PL')}
                        </span>
                      ) : 'Nie wymagana'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Szczegóły
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-2 text-lg font-medium">Brak wizyt</h3>
            <p className="text-muted-foreground mt-1">
              Ten klient nie ma jeszcze zarejestrowanych wizyt
            </p>
            {client.id && pets.length > 0 && (
              <ResponsiveVisitForm
                petId={pets[0].id}
                clientId={client.id}
                buttonText="Zaplanuj pierwszą wizytę"
                className="mt-4"
                onVisitSaved={onVisitAdded}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientVisitsTab;
