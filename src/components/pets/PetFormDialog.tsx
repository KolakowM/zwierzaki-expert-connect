
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PetForm from "./PetForm";
import { Dog, Edit } from "lucide-react";
import { Pet } from "@/types";

interface PetFormDialogProps {
  clientId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<Pet>;
  onPetSaved?: (pet: Pet) => void;
  className?: string;
  isEditing?: boolean;
}

const PetFormDialog = ({
  clientId,
  buttonText = "Dodaj zwierzaka",
  buttonVariant = "outline",
  buttonSize = "default",
  title,
  defaultValues,
  onPetSaved,
  className,
  isEditing = false,
}: PetFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj dane zwierzaka" : "Dodaj nowego zwierzaka");

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      console.log("Saving pet:", formData);
      
      // If editing, maintain the original ID, otherwise generate a new one
      const petData = isEditing 
        ? { ...defaultValues, ...formData }
        : {
            ...formData,
            id: `pet-${Date.now()}`,
            clientId,
            createdAt: new Date().toISOString(),
          };

      // Success notification
      toast({
        title: isEditing ? "Dane zwierzaka zaktualizowane" : "Zwierzak dodany pomyślnie",
        description: isEditing 
          ? `Dane zwierzaka ${formData.name} zostały zaktualizowane` 
          : `Dodano zwierzaka ${formData.name}`,
      });

      // Call the callback if provided
      if (onPetSaved) {
        onPetSaved(petData as Pet);
      }

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error saving pet:", error);
      toast({
        title: isEditing ? "Błąd podczas aktualizacji danych" : "Błąd podczas dodawania zwierzaka",
        description: "Spróbuj ponownie później",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Dog className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <PetForm 
          clientId={clientId}
          defaultValues={defaultValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default PetFormDialog;
