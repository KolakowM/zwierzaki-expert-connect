
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PetForm from "./PetForm";
import { PetSpecies, PetSex, PetFormOutput } from "./PetFormSchema";
import { Dog, Edit } from "lucide-react";
import { Pet } from "@/types";
import { createPet, updatePet } from "@/services/petService";
import { useQueryClient } from "@tanstack/react-query";

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
  children?: React.ReactNode;
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
  children,
}: PetFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj dane zwierzaka" : "Dodaj nowego zwierzaka");

  // Convert Pet type to PetForm expected types
  const formDefaultValues = defaultValues ? {
    ...defaultValues,
    // Convert number values to strings for the form inputs
    age: defaultValues.age?.toString() || '',
    weight: defaultValues.weight?.toString() || '',
    species: defaultValues.species as PetSpecies,
    sex: defaultValues.sex as PetSex || undefined
  } : undefined;

  const handleSubmit = async (formData: PetFormOutput) => {
    try {
      setIsSubmitting(true);
      console.log("Saving pet:", formData);
      
      let petData: Pet;
      
      if (isEditing && defaultValues?.id) {
        // Update existing pet
        petData = await updatePet(defaultValues.id, {
          ...formData,
          clientId
        });
        
        toast({
          title: "Dane zwierzaka zaktualizowane",
          description: `Dane zwierzaka ${formData.name} zostały zaktualizowane pomyślnie`
        });
      } else {
        // Create new pet
        // Ensure required fields are present for new pet creation
        if (!formData.name || !formData.species) {
          throw new Error("Imię i gatunek zwierzęcia są wymagane");
        }
        
        petData = await createPet({
          name: formData.name,
          species: formData.species,
          clientId,
          breed: formData.breed,
          age: formData.age,
          weight: formData.weight,
          sex: formData.sex,
          neutered: formData.neutered,
          medicalHistory: formData.medicalHistory,
          allergies: formData.allergies,
          dietaryRestrictions: formData.dietaryRestrictions,
          behavioralNotes: formData.behavioralNotes
        });
        
        toast({
          title: "Zwierzak dodany pomyślnie",
          description: `Dodano zwierzaka ${formData.name}`,
        });
      }

      // Invalidate queries to refresh data
      if (defaultValues?.id) {
        queryClient.invalidateQueries({ queryKey: ['pet', defaultValues.id] });
      }
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      if (defaultValues?.clientId) {
        queryClient.invalidateQueries({ queryKey: ['pets', defaultValues.clientId] });
      }

      // Call the callback if provided
      if (onPetSaved) {
        onPetSaved(petData);
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
        {children ? (
          children
        ) : (
          <Button variant={buttonVariant} size={buttonSize} className={className}>
            {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Dog className="mr-2 h-4 w-4" />}
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Edytuj informacje o zwierzaku" 
              : "Wprowadź dane nowego zwierzaka"}
          </DialogDescription>
        </DialogHeader>
        <PetForm 
          clientId={clientId}
          defaultValues={formDefaultValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default PetFormDialog;
