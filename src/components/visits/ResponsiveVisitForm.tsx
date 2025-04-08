
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
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ResponsiveVisitForm = (props: ResponsiveVisitFormProps) => {
  const isMobile = useIsMobile();
  
  return isMobile 
    ? <VisitFormDrawer {...props} /> 
    : <VisitFormDialog {...props} />;
};

export default ResponsiveVisitForm;
