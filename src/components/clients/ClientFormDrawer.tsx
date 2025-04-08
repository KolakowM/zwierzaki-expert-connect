
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger,
  DrawerFooter 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ClientForm from "./ClientForm";
import { UserPlus, Edit } from "lucide-react";
import { Client } from "@/types";
import { createClient, updateClient } from "@/services/clientService";
import { ReactNode } from "react";

interface ClientFormDrawerProps {
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<Client>;
  onClientSaved?: (client: Client) => void;
  children?: ReactNode;
  isEditing?: boolean;
}

const ClientFormDrawer = ({
  buttonText = "Dodaj klienta",
  buttonVariant = "default",
  buttonSize = "default",
  title,
  defaultValues,
  onClientSaved,
  children,
  isEditing = false,
}: ClientFormDrawerProps) => {
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

      if (onClientSaved) {
        onClientSaved(clientData);
      }

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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          {children || (
            <>
              {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {buttonText}
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{dialogTitle}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          <ClientForm 
            defaultValues={defaultValues} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
        <DrawerFooter className="pt-2 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>Anuluj</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ClientFormDrawer;
