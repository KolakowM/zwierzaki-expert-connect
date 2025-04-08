
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientForm from "./ClientForm";
import { UserPlus, Edit } from "lucide-react";
import { Client } from "@/types";
import { createClient, updateClient } from "@/services/clientService";
import { ReactNode } from "react";

interface ClientFormDialogProps {
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<Client>;
  onClientSaved?: (client: Client) => void;
  children?: ReactNode;
  isEditing?: boolean;
}

const ClientFormDialog = ({
  buttonText = "Dodaj klienta",
  buttonVariant = "default",
  buttonSize = "default",
  title,
  defaultValues,
  onClientSaved,
  children,
  isEditing = false,
}: ClientFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj dane klienta" : "Dodaj nowego klienta");

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      let clientData: Client;
      
      if (isEditing && defaultValues?.id) {
        // Update existing client
        clientData = await updateClient(defaultValues.id, formData);
        
        toast({
          title: "Klient zaktualizowany",
          description: `Dane klienta ${formData.firstName} ${formData.lastName} zostały pomyślnie zaktualizowane`,
        });
      } else {
        // Create new client
        clientData = await createClient(formData);
        
        toast({
          title: "Klient dodany pomyślnie",
          description: `${formData.firstName} ${formData.lastName}`,
        });
      }

      // Call the callback if provided
      if (onClientSaved) {
        onClientSaved(clientData);
      }

      // Close the dialog
      setOpen(false);
    } catch (error: any) {
      console.error("Error saving client:", error);
      toast({
        title: "Błąd podczas zapisywania klienta",
        description: error.message || "Spróbuj ponownie później",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          {children || (
            <>
              {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {buttonText}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <ClientForm 
          defaultValues={defaultValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
