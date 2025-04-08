
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ResponsiveClientForm from "./ResponsiveClientForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClientHeaderProps {
  client: Client;
  onClientUpdated: (client: Client) => void;
  onDeleteClient: () => void;
  deleteWarning?: string;
}

const ClientHeader = ({
  client,
  onClientUpdated,
  onDeleteClient,
  deleteWarning = "",
}: ClientHeaderProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">
        {client.firstName} {client.lastName}
      </h1>
      
      <div className="flex space-x-2">
        <ResponsiveClientForm 
          buttonText="Edytuj"
          buttonVariant="outline"
          buttonSize="sm"
          title="Edytuj dane klienta"
          defaultValues={client}
          onClientSaved={onClientUpdated}
          isEditing={true}
        >
          <Edit className="mr-2 h-4 w-4" /> Edytuj
        </ResponsiveClientForm>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Usuń klienta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć tego klienta?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Wszystkie dane klienta, w tym historia wizyt i dane zwierząt, zostaną trwale usunięte.
              {deleteWarning && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  {deleteWarning.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={onDeleteClient}
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientHeader;
