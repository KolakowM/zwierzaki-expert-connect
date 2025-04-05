
import { useIsMobile } from "@/hooks/use-mobile";
import PetFormDialog from "./PetFormDialog";
import PetFormDrawer from "./PetFormDrawer";

interface ResponsivePetFormProps {
  clientId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: any;
  onPetSaved?: (pet: any) => void;
}

const ResponsivePetForm = (props: ResponsivePetFormProps) => {
  const isMobile = useIsMobile();
  
  return isMobile 
    ? <PetFormDrawer {...props} /> 
    : <PetFormDialog {...props} />;
};

export default ResponsivePetForm;
