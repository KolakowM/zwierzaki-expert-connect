
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
import { UserPlus } from "lucide-react";
import { createClient } from "@/services/clientService";

interface ClientFormDrawerProps {
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: any;
  onClientSaved?: (client: any) => void;
}

const ClientFormDrawer = ({
  buttonText = "Dodaj klienta",
  buttonVariant = "default",
  buttonSize = "default",
  title = "Dodaj nowego klienta",
  defaultValues,
  onClientSaved,
}: ClientFormDrawerProps) => {
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

      toast({
        title: defaultValues?.id ? "Klient zaktualizowany" : "Klient dodany pomyślnie",
        description: `${formData.firstName} ${formData.lastName}`,
      });

      if (onClientSaved) {
        onClientSaved(newClient);
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
          <UserPlus className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
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
