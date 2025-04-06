
import { Client } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ResponsiveClientForm from "@/components/clients/ResponsiveClientForm";
import DeleteClientButton from "./DeleteClientButton";

interface ClientTableRowProps {
  client: Client;
}

const ClientTableRow = ({ client }: ClientTableRowProps) => {
  const queryClient = useQueryClient();
  
  return (
    <TableRow key={client.id}>
      <TableCell className="font-medium">
        {client.firstName} {client.lastName}
      </TableCell>
      <TableCell>{client.email}</TableCell>
      <TableCell>{client.phone || "-"}</TableCell>
      <TableCell className="hidden md:table-cell">{client.city || "-"}</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(client.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/clients/${client.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <ResponsiveClientForm
              buttonText=""
              buttonVariant="ghost"
              buttonSize="icon"
              defaultValues={client}
              title={`Edytuj: ${client.firstName} ${client.lastName}`}
              onClientSaved={() => {
                queryClient.invalidateQueries({ queryKey: ['clients'] });
                queryClient.invalidateQueries({ queryKey: ['client', client.id] });
              }}
            >
              <Edit className="h-4 w-4" />
            </ResponsiveClientForm>
          </Button>
          <DeleteClientButton client={client} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ClientTableRow;
