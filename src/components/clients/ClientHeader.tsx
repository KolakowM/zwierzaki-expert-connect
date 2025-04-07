
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "@/types";
import ResponsiveClientForm from "@/components/clients/ResponsiveClientForm";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";

interface ClientHeaderProps {
  client: Client;
  onClientUpdated: (client: Client) => void;
  onDeleteClient: () => void;
  deleteWarning?: string;
}

const ClientHeader = ({ client, onClientUpdated, onDeleteClient, deleteWarning }: ClientHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <User className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">{client.firstName} {client.lastName}</h1>
      </div>
      <div className="flex space-x-2">
        <ResponsiveClientForm 
          buttonText="Edytuj klienta" 
          buttonVariant="outline" 
          buttonSize="default"
          title={`Edytuj dane: ${client.firstName} ${client.lastName}`}
          defaultValues={client}
          onClientSaved={onClientUpdated}
        />
        
        <ConfirmDeleteDialog
          title={`Usuń klienta: ${client.firstName} ${client.lastName}`}
          description="Czy na pewno chcesz usunąć tego klienta?"
          additionalWarning={deleteWarning}
          onConfirm={onDeleteClient}
          triggerButtonVariant="destructive"
          triggerButtonText="Usuń klienta"
        />
      </div>
    </div>
  );
};

export default ClientHeader;
