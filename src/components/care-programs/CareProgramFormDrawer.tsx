
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
import CareProgramForm from "./CareProgramForm";
import { Clipboard, Edit } from "lucide-react";
import { CareProgram } from "@/types";
import { createCareProgram, updateCareProgram } from "@/services/careProgramService";

interface CareProgramFormDrawerProps {
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

const CareProgramFormDrawer = ({
  petId,
  buttonText = "Nowy plan opieki",
  buttonVariant = "default",
  buttonSize = "default",
  title,
  defaultValues,
  onCareProgramSaved,
  className,
  isEditing = false,
}: CareProgramFormDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Set default title based on whether we're editing or creating
  const drawerTitle = title || (isEditing ? "Edytuj plan opieki" : "Utwórz nowy plan opieki");

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

      // Close the drawer
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
          {buttonText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{drawerTitle}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          <CareProgramForm 
            petId={petId}
            defaultValues={defaultValues} 
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

export default CareProgramFormDrawer;
