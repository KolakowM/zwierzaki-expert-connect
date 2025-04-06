
import { Client } from "@/types";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ClientTableHeader from "./ClientTableHeader";
import ClientTableRow from "./ClientTableRow";

interface ClientTableProps {
  clients: Client[];
  isLoading: boolean;
  handleSort: (column: string) => void;
}

const ClientTable = ({ clients, isLoading, handleSort }: ClientTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <ClientTableHeader handleSort={handleSort} />
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : clients.length > 0 ? (
            clients.map((client) => (
              <ClientTableRow key={client.id} client={client} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nie znaleziono klientów
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientTable;
