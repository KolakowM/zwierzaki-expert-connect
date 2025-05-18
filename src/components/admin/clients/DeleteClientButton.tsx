
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteClient, getRelatedEntitiesCount } from "@/services/clientService";

interface DeleteClientButtonProps {
  clientId: string;
  clientName: string;
  onClientDeleted?: () => void;
}

const DeleteClientButton = ({ clientId, clientName, onClientDeleted }: DeleteClientButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasRelatedEntities, setHasRelatedEntities] = useState(false);
  const [relatedEntities, setRelatedEntities] = useState({ pets: 0, visits: 0 });
  const { toast } = useToast();

  const handleOpenChange = async (isOpen: boolean) => {
    if (isOpen) {
      try {
        const counts = await getRelatedEntitiesCount(clientId);
        setRelatedEntities(counts);
        setHasRelatedEntities(counts.pets > 0 || counts.visits > 0);
      } catch (error) {
        console.error("Error checking related entities:", error);
      }
    }
    
    setOpen(isOpen);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteClient(clientId);
      
      toast({
        title: "Klient usunięty",
        description: `${clientName} został usunięty z systemu`,
      });
      
      if (onClientDeleted) {
        onClientDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "Błąd usuwania",
        description: error.message || "Wystąpił błąd podczas usuwania klienta",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => handleOpenChange(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Zamierzasz usunąć klienta <strong>{clientName}</strong>. Ta operacja jest nieodwracalna.
              </p>
              
              {hasRelatedEntities && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="font-medium text-amber-700">Uwaga: Ten klient posiada powiązane dane</p>
                  <ul className="list-disc list-inside mt-1 text-sm text-amber-600">
                    {relatedEntities.pets > 0 && (
                      <li>Powiązanych zwierząt: {relatedEntities.pets}</li>
                    )}
                    {relatedEntities.visits > 0 && (
                      <li>Powiązanych wizyt: {relatedEntities.visits}</li>
                    )}
                  </ul>
                  <p className="mt-1 text-sm text-amber-700">
                    Usunięcie klienta spowoduje usunięcie wszystkich powiązanych danych.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Usuwanie..." : "Usuń"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteClientButton;
