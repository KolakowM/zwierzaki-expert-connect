
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2, CheckCircle } from "lucide-react";
import { Visit } from "@/types";

interface VisitTableRowProps {
  visit: Visit;
  getPetName: (petId: string) => string;
  getClientName: (clientId: string) => string;
  formatDate: (dateString: string | Date) => string;
  onDelete: (id: string, type: string) => void;
}

const VisitTableRow = ({ 
  visit, 
  getPetName, 
  getClientName, 
  formatDate, 
  onDelete 
}: VisitTableRowProps) => {
  return (
    <TableRow key={visit.id}>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          {formatDate(visit.date)}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{visit.type}</Badge>
      </TableCell>
      <TableCell className="font-medium">{getPetName(visit.petId)}</TableCell>
      <TableCell className="hidden md:table-cell">{getClientName(visit.clientId)}</TableCell>
      <TableCell className="hidden md:table-cell">
        {visit.followUpNeeded ? (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            {visit.followUpDate ? formatDate(visit.followUpDate) : "Tak"}
          </div>
        ) : "Nie"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(visit.id, visit.type)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default VisitTableRow;
