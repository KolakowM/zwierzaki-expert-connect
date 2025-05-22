
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Visit, Client, Pet } from "@/types";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVisit } from "@/services/visitService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/constants/visitStatuses";

interface VisitDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
  client?: Client | null;
  pet?: Pet | null;
}

const VisitDetailsDialog = ({ isOpen, onClose, visit, client, pet }: VisitDetailsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete visit mutation
  const deleteVisitMutation = useMutation({
    mutationFn: (visitId: string) => {
      return deleteVisit(visitId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast({
        title: "Wizyta anulowana",
        description: "Wizyta została usunięta z kalendarza",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error deleting visit:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć wizyty",
        variant: "destructive",
      });
    }
  });

  if (!visit) return null;
  
  const statusColor = getStatusColor(visit.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Szczegóły wizyty</DialogTitle>
          <DialogDescription>
            Informacje o zaplanowanej wizycie
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Data i godzina</p>
              <p>{format(
                  typeof visit.date === 'string' 
                    ? new Date(visit.date) 
                    : visit.date, 
                  "dd.MM.yyyy"
                )}
                {visit.time ? `, ${visit.time}` : ''}
              </p>
            </div>
            
            <Badge className={`${statusColor} border`}>
              {visit.status || "Planowana"}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Typ wizyty</p>
            <p>{visit.type}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Klient</p>
            <p>
              {client ? `${client.firstName} ${client.lastName}` : "Nieznany klient"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Zwierzę</p>
            <p>
              {pet ? `${pet.name} (${pet.species}, ${pet.breed || "nieznana rasa"})` : "Nieznane zwierzę"}
            </p>
          </div>

          {visit.notes && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Notatki</p>
              <p className="text-sm">{visit.notes}</p>
            </div>
          )}

          {visit.recommendations && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Zalecenia</p>
              <p className="text-sm">{visit.recommendations}</p>
            </div>
          )}

          {visit.followUpNeeded && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Wizyta kontrolna</p>
              <p className="text-amber-600">
                {visit.followUpDate 
                  ? `Zaplanowana na ${new Date(visit.followUpDate).toLocaleDateString('pl-PL')}` 
                  : 'Wymagana'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Zamknij
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteVisitMutation.mutate(visit.id)}
            disabled={deleteVisitMutation.isPending}
          >
            {deleteVisitMutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Anulowanie...
              </>
            ) : "Anuluj wizytę"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VisitDetailsDialog;
