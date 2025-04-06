
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CareProgramForm from "./CareProgramForm";
import { Clipboard, Edit } from "lucide-react";
import { CareProgram } from "@/types";
import { createCareProgram, updateCareProgram } from "@/services/careProgramService";

interface CareProgramFormDialogProps {
  petId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<CareProgram>;
  onCareProgramSaved?: (careProgram: CareProgram) => void;
  className?: string;
  isEditing?: boolean;
}

const CareProgramFormDialog = ({
  petId,
  buttonText = "Nowy plan opieki",
  buttonVariant = "default",
  buttonSize = "default",
  title,
  defaultValues,
  onCareProgramSaved,
  className,
  isEditing = false,
}: CareProgramFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj plan opieki" : "Utwórz nowy plan opieki");

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      console.log("Saving care program:", formData);
      
      let careProgramData: CareProgram;
      
      if (isEditing && defaultValues?.id) {
        // Update existing care program
        careProgramData = await updateCareProgram(defaultValues.id, {
          ...formData,
          petId,
        });
        
        toast({
          title: "Plan opieki zaktualizowany",
          description: `Plan opieki "${formData.name}" został zaktualizowany`
        });
      } else {
        // Create new care program
        careProgramData = await createCareProgram({
          ...formData,
          petId,
        });
        
        toast({
          title: "Plan opieki utworzony",
          description: `Plan opieki "${formData.name}" został utworzony`,
        });
      }

      // Call the callback if provided
      if (onCareProgramSaved) {
        onCareProgramSaved(careProgramData);
      }

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error saving care program:", error);
      toast({
        title: isEditing ? "Błąd podczas aktualizacji planu" : "Błąd podczas tworzenia planu",
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
          {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <CareProgramForm 
          petId={petId}
          defaultValues={defaultValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CareProgramFormDialog;
