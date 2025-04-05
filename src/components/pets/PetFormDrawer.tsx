
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
import PetForm from "./PetForm";
import { Dog } from "lucide-react";

interface PetFormDrawerProps {
  clientId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: any;
  onPetSaved?: (pet: any) => void;
}

const PetFormDrawer = ({
  clientId,
  buttonText = "Dodaj zwierzaka",
  buttonVariant = "outline",
  buttonSize = "default",
  title = "Dodaj nowego zwierzaka",
  defaultValues,
  onPetSaved,
}: PetFormDrawerProps) => {
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

      // Close the drawer
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          <Dog className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          <PetForm 
            clientId={clientId}
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

export default PetFormDrawer;
