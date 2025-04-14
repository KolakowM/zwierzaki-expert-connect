
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Edit } from "lucide-react";
import { Pet, Visit } from "@/types";
import ResponsiveVisitForm from "@/components/visits/ResponsiveVisitForm";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface PetVisitsListProps {
  pet: Pet;
  visits: Visit[];
  clientId: string;
  onVisitUpdated?: (visit: Visit) => void;
}

const PetVisitsList = ({ pet, visits, clientId, onVisitUpdated }: PetVisitsListProps) => {
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleEditVisit = (visit: Visit) => {
    setEditingVisit(visit);
  };

  const handleVisitSaved = (updatedVisit: Visit) => {
    queryClient.invalidateQueries({ queryKey: ['visits'] });
    if (onVisitUpdated) {
      onVisitUpdated(updatedVisit);
    }
    
    toast({
      title: "Wizyta zaktualizowana",
      description: "Dane wizyty zostały pomyślnie zaktualizowane",
    });
    
    setEditingVisit(null);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Historia wizyt</CardTitle>
        {pet.id && clientId && (
          <ResponsiveVisitForm
            petId={pet.id}
            clientId={clientId}
            buttonText="Dodaj wizytę"
            onVisitSaved={handleVisitSaved}
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
                <TableHead>Notatki</TableHead>
                <TableHead>Kontrola</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit) => {
                const visitTime = visit.time || "";
                
                return (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">
                      {new Date(visit.date).toLocaleDateString('pl-PL')}
                    </TableCell>
                    <TableCell>{visitTime}</TableCell>
                    <TableCell>{visit.type}</TableCell>
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
                        <Edit className="h-4 w-4 mr-1" />
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
              To zwierzę nie ma jeszcze zarejestrowanych wizyt
            </p>
            {pet.id && clientId && (
              <ResponsiveVisitForm
                petId={pet.id}
                clientId={clientId}
                buttonText="Zaplanuj pierwszą wizytę"
                className="mt-4"
                onVisitSaved={handleVisitSaved}
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
          title="Edytuj wizytę"
          onVisitSaved={handleVisitSaved}
        />
      )}
    </Card>
  );
};

export default PetVisitsList;
