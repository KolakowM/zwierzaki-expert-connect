
import { useState } from "react";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { deleteClient, getRelatedEntitiesCount } from "@/services/clientService";

interface DeleteClientButtonProps {
  client: Client;
}

const DeleteClientButton = ({ client }: DeleteClientButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogProps, setDialogProps] = useState<{
    title: string;
    description: string;
    additionalWarning?: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const prepareDeleteDialog = async () => {
    try {
      setIsLoading(true);
      const props = await handleDeleteClient(client);
      setDialogProps(props);
    } catch (error) {
      console.error("Error preparing delete dialog:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas przygotowywania usunięcia. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (client: Client) => {
    try {
      // Pobierz liczbę powiązanych encji przed usunięciem
      const relatedEntities = await getRelatedEntitiesCount(client.id);
      
      if (
        relatedEntities.petsCount > 0 || 
        relatedEntities.visitsCount > 0 || 
        relatedEntities.careProgramsCount > 0
      ) {
        // Pokaż szczegółowe ostrzeżenie
        const deleteMessage = `
          Wraz z klientem zostaną również usunięte:
          ${relatedEntities.petsCount > 0 ? `\n- ${relatedEntities.petsCount} zwierząt` : ''}
          ${relatedEntities.visitsCount > 0 ? `\n- ${relatedEntities.visitsCount} wizyt` : ''}
          ${relatedEntities.careProgramsCount > 0 ? `\n- ${relatedEntities.careProgramsCount} programów opieki` : ''}
        `;
        
        // Usuwanie z ostrzeżeniem o powiązanych danych
        return {
          title: `Usuń klienta: ${client.firstName} ${client.lastName}`,
          description: "Czy na pewno chcesz usunąć tego klienta?",
          additionalWarning: deleteMessage.trim(),
          onConfirm: async () => {
            await deleteClient(client.id);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            
            toast({
              title: "Klient usunięty",
              description: `Klient ${client.firstName} ${client.lastName} oraz wszystkie powiązane dane zostały pomyślnie usunięte`
            });
          }
        };
      } else {
        // Standardowe usuwanie bez ostrzeżeń
        return {
          title: `Usuń klienta: ${client.firstName} ${client.lastName}`,
          description: "Czy na pewno chcesz usunąć tego klienta?",
          onConfirm: async () => {
            await deleteClient(client.id);
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            
            toast({
              title: "Klient usunięty",
              description: `Klient ${client.firstName} ${client.lastName} został pomyślnie usunięty`
            });
          }
        };
      }
    } catch (error) {
      console.error("Error preparing client deletion:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas przygotowywania usuwania klienta. Spróbuj ponownie.",
        variant: "destructive"
      });
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
      </Button>
    );
  }

  return (
    dialogProps ? (
      <ConfirmDeleteDialog
        title={dialogProps.title}
        description={dialogProps.description}
        additionalWarning={dialogProps.additionalWarning}
        onConfirm={dialogProps.onConfirm}
        triggerButtonVariant="ghost"
        triggerButtonSize="icon"
      >
        <Button
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ConfirmDeleteDialog>
    ) : (
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-red-500 hover:text-red-700"
        onClick={prepareDeleteDialog}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    )
  );
};

export default DeleteClientButton;
