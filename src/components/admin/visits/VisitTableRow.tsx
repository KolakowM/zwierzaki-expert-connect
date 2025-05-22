
import { Visit } from "@/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { CalendarPlus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/constants/visitStatuses";

interface VisitTableRowProps {
  visit: Visit;
  getClientName: (clientId: string) => string;
  getPetName: (petId: string) => string;
  formatDate: (date: string | Date) => string;
  onDelete: (id: string, type: string) => void;
}

const VisitTableRow = ({
  visit,
  getClientName,
  getPetName,
  formatDate,
  onDelete
}: VisitTableRowProps) => {
  const clientName = getClientName(visit.clientId);
  const petName = getPetName(visit.petId);
  
  const statusColor = getStatusColor(visit.status);

  return (
    <TableRow>
      <TableCell>
        {formatDate(visit.date)}
        {visit.time && <div className="text-sm text-gray-500">{visit.time}</div>}
      </TableCell>
      <TableCell>
        {petName}
        <div className="text-sm text-gray-500">
          <Link to={`/clients/${visit.clientId}`} className="hover:underline">
            {clientName}
          </Link>
        </div>
      </TableCell>
      <TableCell>{visit.type}</TableCell>
      <TableCell>
        <Badge className={`${statusColor} border`}>
          {visit.status || "Planowana"}
        </Badge>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/pets/${visit.petId}`}>
            <CalendarPlus className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link to={`/clients/${visit.clientId}`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onDelete(visit.id, visit.type)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default VisitTableRow;
