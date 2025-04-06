
import { useIsMobile } from "@/hooks/use-mobile";
import CareProgramFormDialog from "./CareProgramFormDialog";
import CareProgramFormDrawer from "./CareProgramFormDrawer";
import { CareProgram } from "@/types";
import { ReactNode } from "react";

interface ResponsiveCareProgramFormProps {
  petId: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<CareProgram>;
  onCareProgramSaved?: (careProgram: CareProgram) => void;
  className?: string;
  isEditing?: boolean;
  children?: ReactNode;
}

const ResponsiveCareProgramForm = (props: ResponsiveCareProgramFormProps) => {
  const isMobile = useIsMobile();
  
  return isMobile 
    ? <CareProgramFormDrawer {...props} /> 
    : <CareProgramFormDialog {...props} />;
};

export default ResponsiveCareProgramForm;
