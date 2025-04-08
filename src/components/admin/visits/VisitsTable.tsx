
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import VisitTableHeader from "./VisitTableHeader";
import VisitTableRow from "./VisitTableRow";
import { Visit } from "@/types";

interface VisitsTableProps {
  visits: Visit[];
  isLoading: boolean;
  getPetName: (petId: string) => string;
  getClientName: (clientId: string) => string;
  formatDate: (dateString: string | Date) => string;
  handleSort: (column: string) => void;
  handleDeleteVisit: (id: string, type: string) => void;
}

const VisitsTable = ({ 
  visits, 
  isLoading, 
  getPetName, 
  getClientName, 
  formatDate, 
  handleSort, 
  handleDeleteVisit 
}: VisitsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <VisitTableHeader handleSort={handleSort} />
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : visits.length > 0 ? (
            visits.map((visit) => (
              <VisitTableRow 
                key={visit.id} 
                visit={visit} 
                getPetName={getPetName} 
                getClientName={getClientName} 
                formatDate={formatDate} 
                onDelete={handleDeleteVisit}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nie znaleziono wizyt
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitsTable;
