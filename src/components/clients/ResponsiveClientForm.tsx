
import { useIsMobile } from "@/hooks/use-mobile";
import ClientFormDialog from "./ClientFormDialog";
import ClientFormDrawer from "./ClientFormDrawer";
import { ReactNode } from "react";
import { Client } from "@/types";

interface ResponsiveClientFormProps {
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  defaultValues?: Partial<Client>;
  onClientSaved?: (client: Client) => void;
  children?: ReactNode;
  isEditing?: boolean;
}

const ResponsiveClientForm = (props: ResponsiveClientFormProps) => {
  const isMobile = useIsMobile();
  
  return isMobile 
    ? <ClientFormDrawer {...props} /> 
    : <ClientFormDialog {...props} />;
};

export default ResponsiveClientForm;
