
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
  
  // Convert string dates to Date objects if they exist
  const convertedDefaultValues = props.defaultValues ? {
    ...props.defaultValues,
    startDate: props.defaultValues.startDate ? new Date(props.defaultValues.startDate) : undefined,
    endDate: props.defaultValues.endDate ? new Date(props.defaultValues.endDate) : undefined,
  } : undefined;
  
  const updatedProps = {
    ...props,
    defaultValues: convertedDefaultValues
  };
  
  return isMobile 
    ? <CareProgramFormDrawer {...updatedProps} /> 
    : <CareProgramFormDialog {...updatedProps} />;
};

export default ResponsiveCareProgramForm;
