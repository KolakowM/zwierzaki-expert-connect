
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PetForm from "./PetForm";
import { createPet, updatePet } from "@/services/petService";
import { Pet } from "@/types";
import { PawPrint, Edit } from "lucide-react";
import { ReactNode } from "react";

interface PetFormDialogProps {
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  clientId?: string;
  title?: string;
  defaultValues?: Partial<Pet>;
  onPetSaved?: (pet: Pet) => void;
  isEditing?: boolean;
  children?: ReactNode;
}

const PetFormDialog = ({
  buttonText = "Dodaj zwierzę",
  buttonVariant = "default",
  buttonSize = "default",
  clientId,
  title,
  defaultValues,
  onPetSaved,
  isEditing = false,
  children,
}: PetFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj dane zwierzęcia" : "Dodaj nowe zwierzę");

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      let petData: Pet;
      
      if (isEditing && defaultValues?.id) {
        // Update existing pet
        petData = await updatePet(defaultValues.id, formData);
        
        toast({
          title: "Dane zwierzęcia zaktualizowane",
          description: `Dane ${formData.name} zostały pomyślnie zaktualizowane`,
        });
      } else {
        // Create new pet with clientId
        const newPetData = {
          ...formData,
          clientId: clientId || formData.clientId
        };
        
        petData = await createPet(newPetData);
        
        toast({
          title: "Zwierzę dodane pomyślnie",
          description: `${formData.name} zostało dodane do systemu`,
        });
      }

      // Call the callback if provided
      if (onPetSaved) {
        onPetSaved(petData);
      }

      // Close the dialog
      setOpen(false);
    } catch (error: any) {
      console.error("Error saving pet:", error);
      toast({
        title: "Błąd podczas zapisywania danych",
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
              {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <PawPrint className="mr-2 h-4 w-4" />}
              {buttonText}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <PetForm 
          defaultValues={defaultValues as any} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          clientId={clientId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PetFormDialog;
