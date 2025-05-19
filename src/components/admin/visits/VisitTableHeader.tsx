
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VisitTableHeaderProps {
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  handleSort: (column: string) => void;
}

const VisitTableHeader = ({ sortBy, sortOrder, handleSort }: VisitTableHeaderProps) => {
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortOrder === "asc" ? 
      <ArrowUpAZ className="h-4 w-4 ml-1" /> : 
      <ArrowDownAZ className="h-4 w-4 ml-1" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => handleSort("date")}
            className="p-0 font-medium flex items-center hover:bg-transparent"
          >
            Data {renderSortIcon("date")}
          </Button>
        </TableHead>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => handleSort("client")}
            className="p-0 font-medium flex items-center hover:bg-transparent"
          >
            Pacjent / Klient {renderSortIcon("client")}
          </Button>
        </TableHead>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => handleSort("type")}
            className="p-0 font-medium flex items-center hover:bg-transparent"
          >
            Typ wizyty {renderSortIcon("type")}
          </Button>
        </TableHead>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => handleSort("status")}
            className="p-0 font-medium flex items-center hover:bg-transparent"
          >
            Status {renderSortIcon("status")}
          </Button>
        </TableHead>
        <TableHead className="text-right">Akcje</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default VisitTableHeader;
