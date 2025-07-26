
import { useState, useRef } from "react";
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
import CareProgramForm from "./CareProgramForm";
import { ListPlus, Edit } from "lucide-react";
import { CareProgram } from "@/types";
import { createCareProgram, updateCareProgram } from "@/services/careProgramService";
import { useQueryClient } from "@tanstack/react-query";

interface CareProgramFormDrawerProps {
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

const CareProgramFormDrawer = ({
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
}: CareProgramFormDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set default title based on whether we're editing or creating
  const drawerTitle = title || (isEditing ? "Edytuj program opieki" : "Dodaj nowy program opieki");

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
          petId,
          status: formData.status || "aktywny" // Ensure status is set
        });
        
        toast({
          title: "Program opieki dodany",
          description: `Program opieki został pomyślnie dodany`,
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['carePrograms'] });
      queryClient.invalidateQueries({ queryKey: ['carePrograms', petId] });

      // Call the callback if provided
      if (onCareProgramSaved) {
        onCareProgramSaved(careProgram);
      }

      // Close the drawer
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

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || (
          <Button variant={buttonVariant} size={buttonSize} className={className}>
            {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <ListPlus className="mr-2 h-4 w-4" />}
            {buttonText}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{drawerTitle}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          <CareProgramForm 
            ref={formRef}
            petId={petId}
            defaultValues={formDefaultValues} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            showSubmitButton={false}
          />
        </div>
        <DrawerFooter className="pt-2 border-t flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="flex-1"
          >
            Anuluj
          </Button>
          <Button 
            onClick={handleSaveClick}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Zapisywanie..." : (isEditing ? "Aktualizuj" : "Zapisz")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CareProgramFormDrawer;
