
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ClientForm from "./ClientForm";
import { UserPlus } from "lucide-react";
import { createClient } from "@/services/clientService";

interface ClientFormDialogProps {
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: any;
  onClientSaved?: (client: any) => void;
}

const ClientFormDialog = ({
  buttonText = "Dodaj klienta",
  buttonVariant = "default",
  buttonSize = "default",
  title = "Dodaj nowego klienta",
  defaultValues,
  onClientSaved,
}: ClientFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      let newClient;
      if (defaultValues && defaultValues.id) {
        // Update existing client logic would go here
        newClient = { ...formData, id: defaultValues.id };
      } else {
        // Create new client
        newClient = await createClient(formData);
      }

      // Success notification
      toast({
        title: defaultValues?.id ? "Klient zaktualizowany" : "Klient dodany pomyślnie",
        description: `${formData.firstName} ${formData.lastName}`,
      });

      // Call the callback if provided
      if (onClientSaved) {
        onClientSaved(newClient);
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
          <UserPlus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
