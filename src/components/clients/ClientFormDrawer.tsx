
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
import { createClient, updateClient } from "@/services/clientServiceWithLimits";
import { useAuth } from "@/contexts/AuthProvider";
import { ReactNode } from "react";
import { PackageLimitError } from "@/types/subscription";
import LimitExceededDialog from "@/components/subscription/LimitExceededDialog";

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
  const [limitError, setLimitError] = useState<PackageLimitError | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj dane klienta" : "Dodaj nowego klienta");

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby zapisać klienta",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      let clientData: Client;
      
      if (isEditing && defaultValues?.id) {
        // Update existing client (no limit check needed)
        clientData = await updateClient(defaultValues.id, formData);
        
        toast({
          title: "Klient zaktualizowany",
          description: `Dane klienta ${formData.firstName} ${formData.lastName} zostały pomyślnie zaktualizowane`,
        });
      } else {
        // Create new client with automatic limit validation
        clientData = await createClient({
          ...formData,
          userId: user.id
        });
        
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
      
      if (error instanceof PackageLimitError) {
        setLimitError(error);
        return;
      }
      
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
    <>
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

      {limitError && (
        <LimitExceededDialog
          isOpen={!!limitError}
          onClose={() => setLimitError(null)}
          actionType={limitError.actionType}
          currentCount={limitError.currentCount}
          maxAllowed={limitError.maxAllowed}
          packageName={limitError.packageName}
        />
      )}
    </>
  );
};

export default ClientFormDrawer;
