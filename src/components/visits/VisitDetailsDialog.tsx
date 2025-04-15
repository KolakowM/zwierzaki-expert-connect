
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Visit } from "@/types";
import VisitFormDialog from "./VisitFormDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit } from "lucide-react";

interface VisitDetailsDialogProps {
  visit: Visit;
  petId: string;
  clientId: string;
  onVisitUpdated: (visit: Visit) => void;
  children?: React.ReactNode;
}

const VisitDetailsDialog = ({
  visit,
  petId,
  clientId,
  onVisitUpdated,
  children
}: VisitDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Szczegóły
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Szczegóły wizyty</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div>
                  <p className="font-medium">Data</p>
                  <p>{new Date(visit.date).toLocaleDateString('pl-PL')}</p>
                </div>
                
                <div>
                  <p className="font-medium">Typ wizyty</p>
                  <p>{visit.type}</p>
                </div>
                
                {visit.notes && (
                  <div>
                    <p className="font-medium">Notatki</p>
                    <p className="whitespace-pre-line">{visit.notes}</p>
                  </div>
                )}
                
                {visit.recommendations && (
                  <div>
                    <p className="font-medium">Zalecenia</p>
                    <p className="whitespace-pre-line">{visit.recommendations}</p>
                  </div>
                )}
                
                <div>
                  <p className="font-medium">Kontrola</p>
                  <p>
                    {visit.followUpNeeded ? (
                      <>
                        Wymagana: {new Date(visit.followUpDate || '').toLocaleDateString('pl-PL')}
                      </>
                    ) : (
                      'Nie wymagana'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <VisitFormDialog
              petId={petId}
              clientId={clientId}
              isEditing={true}
              defaultValues={visit}
              onVisitSaved={onVisitUpdated}
              buttonVariant="outline"
            >
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edytuj wizytę
              </Button>
            </VisitFormDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisitDetailsDialog;
