
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VisitForm from "./VisitForm";
import { CalendarPlus, Edit } from "lucide-react";
import { Visit } from "@/types";
import { createVisit, updateVisit } from "@/services/visitServiceWithLimits";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { PackageLimitError } from "@/types/subscription";
import LimitExceededDialog from "@/components/subscription/LimitExceededDialog";

interface VisitFormDialogProps {
  petId: string;
  clientId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<Visit>;
  onVisitSaved?: (visit: Visit) => void;
  className?: string;
  isEditing?: boolean;
  children?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const VisitFormDialog = ({
  petId,
  clientId,
  buttonText = "Dodaj wizytę",
  buttonVariant = "outline",
  buttonSize = "default",
  title,
  defaultValues,
  onVisitSaved,
  className,
  isEditing = false,
  children,
  isOpen: externalOpen,
  onOpenChange: externalOnOpenChange,
}: VisitFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [limitError, setLimitError] = useState<PackageLimitError | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Use external or internal state based on what's provided
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  // Set default title based on whether we're editing or creating
  const dialogTitle = title || (isEditing ? "Edytuj wizytę" : "Dodaj nową wizytę");

  // If defaultValues is present, ensure any date fields that might be strings are converted to Date objects
  const formDefaultValues = defaultValues ? {
    ...defaultValues,
    date: defaultValues.date ? (typeof defaultValues.date === 'string' ? new Date(defaultValues.date) : defaultValues.date) : new Date(),
    followUpDate: defaultValues.followUpDate ? (typeof defaultValues.followUpDate === 'string' ? new Date(defaultValues.followUpDate) : defaultValues.followUpDate) : null,
  } : undefined;

  useEffect(() => {
    // If the dialog is closed and there are validation errors, reset them
    if (!open) {
      setIsSubmitting(false);
      setLimitError(null);
    }
  }, [open]);

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby zapisać wizytę",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Saving visit:", formData);
      
      let visitData: Visit;
      
      if (isEditing && defaultValues?.id) {
        // Update existing visit (no limit check needed)
        visitData = await updateVisit(defaultValues.id, {
          ...formData,
          petId,
          clientId
        });
        
        toast({
          title: "Wizyta zaktualizowana",
          description: `Dane wizyty zostały pomyślnie zaktualizowane`
        });
      } else {
        // Create new visit with automatic limit validation
        visitData = await createVisit({
          ...formData,
          petId,
          clientId,
          userId: user.id
        });
        
        toast({
          title: "Wizyta dodana pomyślnie",
          description: `Nowa wizyta została zapisana`,
        });
      }

      // Call the callback if provided
      if (onVisitSaved) {
        onVisitSaved(visitData);
      }

      // Close the dialog
      setOpen(false);
    } catch (error: any) {
      console.error("Error saving visit:", error);
      
      if (error instanceof PackageLimitError) {
        setLimitError(error);
        return;
      }
      
      toast({
        title: isEditing ? "Błąd podczas aktualizacji wizyty" : "Błąd podczas dodawania wizyty",
        description: error.message || "Spróbuj ponownie później",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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

export default VisitFormDialog;
