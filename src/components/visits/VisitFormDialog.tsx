
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VisitForm from "./VisitForm";
import { CalendarPlus, Edit } from "lucide-react";
import { Visit } from "@/types";
import { createVisit, updateVisit } from "@/services/visitService";

interface VisitFormDialogProps {
  petId: string;
  clientId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<Visit & {
    date?: Date | string;
    followUpDate?: Date | string;
  }>;
  onVisitSaved?: (visit: Visit) => void;
  className?: string;
  isEditing?: boolean;
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const VisitFormDialog = ({
  petId,
  clientId,
  buttonText = "Dodaj wizytę",
  buttonVariant = "default",
  buttonSize = "default",
  title,
  defaultValues,
  onVisitSaved,
  className,
  isEditing = false,
  children,
  isOpen: controlledOpen,
  onOpenChange: controlledOpenChange,
}: VisitFormDialogProps) => {
  // Use controlled state if provided, otherwise use internal state
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined && controlledOpenChange !== undefined;
  
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      controlledOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj wizytę" : "Dodaj nową wizytę");

  // If defaultValues is present, ensure any date fields that might be strings are converted to Date objects
  const formDefaultValues = defaultValues ? {
    ...defaultValues,
    date: defaultValues.date ? (typeof defaultValues.date === 'string' ? new Date(defaultValues.date) : defaultValues.date) : undefined,
    followUpDate: defaultValues.followUpDate ? (typeof defaultValues.followUpDate === 'string' ? new Date(defaultValues.followUpDate) : defaultValues.followUpDate) : undefined
  } : undefined;

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      console.log("Saving visit:", formData);
      
      let visitData: Visit;
      
      if (isEditing && defaultValues?.id) {
        // Update existing visit
        visitData = await updateVisit(defaultValues.id, {
          ...formData,
          petId,
          clientId
        });
        
        toast({
          title: "Wizyta zaktualizowana",
          description: `Dane wizyty zostały zaktualizowane`
        });
      } else {
        // Create new visit
        visitData = await createVisit({
          ...formData,
          petId,
          clientId
        });
        
        toast({
          title: "Wizyta dodana pomyślnie",
          description: `Dodano nową wizytę`,
        });
      }

      // Call the callback if provided
      if (onVisitSaved) {
        onVisitSaved(visitData);
      }

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error saving visit:", error);
      toast({
        title: isEditing ? "Błąd podczas aktualizacji wizyty" : "Błąd podczas dodawania wizyty",
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
            {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <CalendarPlus className="mr-2 h-4 w-4" />}
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <VisitForm 
          petId={petId}
          clientId={clientId}
          defaultValues={formDefaultValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default VisitFormDialog;
