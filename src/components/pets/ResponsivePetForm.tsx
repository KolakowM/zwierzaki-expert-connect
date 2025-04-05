
import { useIsMobile } from "@/hooks/use-mobile";
import PetFormDialog from "./PetFormDialog";
import PetFormDrawer from "./PetFormDrawer";
import { Pet } from "@/types";

interface ResponsivePetFormProps {
  clientId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<Pet>;
  onPetSaved?: (pet: Pet) => void;
  className?: string;
  isEditing?: boolean;
}

const ResponsivePetForm = (props: ResponsivePetFormProps) => {
  const isMobile = useIsMobile();
  
  return isMobile 
    ? <PetFormDrawer {...props} /> 
    : <PetFormDialog {...props} />;
};

export default ResponsivePetForm;
