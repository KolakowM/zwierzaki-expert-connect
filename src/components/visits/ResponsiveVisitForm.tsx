
import { useIsMobile } from "@/hooks/use-mobile";
import VisitFormDialog from "./VisitFormDialog";
import VisitFormDrawer from "./VisitFormDrawer";
import { Visit } from "@/types";
import { ReactNode } from "react";

interface ResponsiveVisitFormProps {
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
}

const ResponsiveVisitForm = (props: ResponsiveVisitFormProps) => {
  const isMobile = useIsMobile();
  
  // Convert string dates to Date objects if they exist
  const convertedDefaultValues = props.defaultValues ? {
    ...props.defaultValues,
    date: props.defaultValues.date ? new Date(props.defaultValues.date) : undefined,
    followUpDate: props.defaultValues.followUpDate ? new Date(props.defaultValues.followUpDate) : undefined
  } : undefined;
  
  const updatedProps = {
    ...props,
    defaultValues: convertedDefaultValues
  };
  
  return isMobile 
    ? <VisitFormDrawer {...updatedProps} /> 
    : <VisitFormDialog {...updatedProps} />;
};

export default ResponsiveVisitForm;
