
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Client, Pet, Visit } from "@/types";
import ResponsiveVisitForm from "@/components/visits/ResponsiveVisitForm";
import { useQueryClient } from "@tanstack/react-query";
import { updateVisit } from "@/services/visitService";
import { useToast } from "@/hooks/use-toast";

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
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleEditVisit = (visit: Visit) => {
    setEditingVisit(visit);
  };

  const handleVisitUpdated = async (updatedVisit: Visit) => {
    try {
      await updateVisit(updatedVisit.id, updatedVisit);
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast({
        title: "Wizyta zaktualizowana",
        description: "Dane wizyty zostały pomyślnie zaktualizowane",
      });
      setEditingVisit(null);
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować wizyty",
        variant: "destructive",
      });
      console.error(error);
    }
  };

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
                <TableHead>Godzina</TableHead>
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
                const visitTime = visit.time || "";
                
                return (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">
                      {new Date(visit.date).toLocaleDateString('pl-PL')}
                    </TableCell>
                    <TableCell>{visitTime}</TableCell>
                    <TableCell>{visit.type}</TableCell>
                    <TableCell>
                      {pet ? (
                        <Link to={`/pets/${pet.id}`} className="hover:underline">
                          {pet.name}
                        </Link>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      {visit.notes ? (
                        <div className="max-w-[200px] overflow-hidden text-ellipsis">
                          {visit.notes.length > 50 ? `${visit.notes.substring(0, 50)}...` : visit.notes}
                        </div>
                      ) : '—'}
                    </TableCell>
                    <TableCell>
                      {visit.followUpNeeded ? (
                        <span className="text-amber-600">
                          {visit.followUpDate ? new Date(visit.followUpDate).toLocaleDateString('pl-PL') : 'Tak'}
                        </span>
                      ) : 'Nie wymagana'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditVisit(visit)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edytuj
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

      {editingVisit && (
        <ResponsiveVisitForm
          isOpen={true}
          onOpenChange={() => setEditingVisit(null)}
          petId={editingVisit.petId}
          clientId={editingVisit.clientId}
          defaultValues={editingVisit}
          buttonText=""
          title="Edytuj wizytę"
          onVisitSaved={handleVisitUpdated}
        />
      )}
    </Card>
  );
};

export default ClientVisitsTab;
