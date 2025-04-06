
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
import VisitForm from "./VisitForm";
import { CalendarPlus, Edit } from "lucide-react";
import { Visit } from "@/types";
import { createVisit, updateVisit } from "@/services/visitService";

interface VisitFormDrawerProps {
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
}

const VisitFormDrawer = ({
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
}: VisitFormDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set default title based on whether we're editing or creating
  const drawerTitle = title || (isEditing ? "Edytuj wizytę" : "Dodaj nową wizytę");

  // If defaultValues is present, ensure any date fields that might be strings are converted to Date objects
  const formDefaultValues = defaultValues ? {
    ...defaultValues,
    date: defaultValues.date ? (defaultValues.date instanceof Date ? defaultValues.date : new Date(defaultValues.date)) : undefined,
    followUpDate: defaultValues.followUpDate ? (defaultValues.followUpDate instanceof Date ? defaultValues.followUpDate : new Date(defaultValues.followUpDate)) : undefined
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

      // Close the drawer
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || (
          <Button variant={buttonVariant} size={buttonSize} className={className}>
            {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <CalendarPlus className="mr-2 h-4 w-4" />}
            {buttonText}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{drawerTitle}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          <VisitForm 
            petId={petId}
            clientId={clientId}
            defaultValues={formDefaultValues} 
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

export default VisitFormDrawer;
