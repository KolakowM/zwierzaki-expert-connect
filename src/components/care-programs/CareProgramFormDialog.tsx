
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CareProgramForm from "./CareProgramForm";
import { ListPlus, Edit } from "lucide-react";
import { CareProgram } from "@/types";
import { createCareProgram, updateCareProgram } from "@/services/careProgramService";

interface CareProgramFormDialogProps {
  petId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<CareProgram & {
    startDate?: Date | string;
    endDate?: Date | string;
  }>;
  onCareProgramSaved?: (careProgram: CareProgram) => void;
  className?: string;
  isEditing?: boolean;
  children?: React.ReactNode;
}

const CareProgramFormDialog = ({
  petId,
  buttonText = "Dodaj program opieki",
  buttonVariant = "default",
  buttonSize = "default",
  title,
  defaultValues,
  onCareProgramSaved,
  className,
  isEditing = false,
  children,
}: CareProgramFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj program opieki" : "Dodaj nowy program opieki");

  // If defaultValues is present, ensure any date fields that might be strings are converted to Date objects
  const formDefaultValues = defaultValues ? {
    ...defaultValues,
    startDate: defaultValues.startDate ? (typeof defaultValues.startDate === 'string' ? new Date(defaultValues.startDate) : defaultValues.startDate) : undefined,
    endDate: defaultValues.endDate ? (typeof defaultValues.endDate === 'string' ? new Date(defaultValues.endDate) : defaultValues.endDate) : undefined
  } : undefined;

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      console.log("Saving care program:", formData);
      
      let careProgram: CareProgram;
      
      if (isEditing && defaultValues?.id) {
        // Update existing care program
        careProgram = await updateCareProgram(defaultValues.id, {
          ...formData,
          petId
        });
        
        toast({
          title: "Program opieki zaktualizowany",
          description: `Program opieki został zaktualizowany pomyślnie`
        });
      } else {
        // Create new care program
        careProgram = await createCareProgram({
          ...formData,
          petId
        });
        
        toast({
          title: "Program opieki dodany",
          description: `Program opieki został pomyślnie dodany`,
        });
      }

      // Call the callback if provided
      if (onCareProgramSaved) {
        onCareProgramSaved(careProgram);
      }

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error saving care program:", error);
      toast({
        title: isEditing ? "Błąd podczas aktualizacji programu opieki" : "Błąd podczas dodawania programu opieki",
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
        {children || (
          <Button variant={buttonVariant} size={buttonSize} className={className}>
            {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <ListPlus className="mr-2 h-4 w-4" />}
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <CareProgramForm 
          petId={petId}
          defaultValues={formDefaultValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CareProgramFormDialog;
