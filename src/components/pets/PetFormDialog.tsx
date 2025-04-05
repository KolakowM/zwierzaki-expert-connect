
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PetForm from "./PetForm";
import { Dog } from "lucide-react";

interface PetFormDialogProps {
  clientId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: any;
  onPetSaved?: (pet: any) => void;
}

const PetFormDialog = ({
  clientId,
  buttonText = "Dodaj zwierzaka",
  buttonVariant = "outline",
  buttonSize = "default",
  title = "Dodaj nowego zwierzaka",
  defaultValues,
  onPetSaved,
}: PetFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      // Here you'd normally submit to an API
      // For now, we'll simulate a successful save
      console.log("Saving pet:", formData);
      
      // Add an ID, client ID, and timestamp to mock what a database would do
      const newPet = {
        ...formData,
        id: `pet-${Date.now()}`,
        clientId,
        createdAt: new Date().toISOString(),
      };

      // Success notification
      toast({
        title: "Zwierzak dodany pomyślnie",
        description: `Dodano zwierzaka ${formData.name}`,
      });

      // Call the callback if provided
      if (onPetSaved) {
        onPetSaved(newPet);
      }

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error saving pet:", error);
      toast({
        title: "Błąd podczas dodawania zwierzaka",
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
        <Button variant={buttonVariant} size={buttonSize}>
          <Dog className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
