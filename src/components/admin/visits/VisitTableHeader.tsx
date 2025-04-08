
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface VisitTableHeaderProps {
  handleSort: (column: string) => void;
}

const VisitTableHeader = ({ handleSort }: VisitTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer"
          onClick={() => handleSort("date")}
        >
          <div className="flex items-center">
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => handleSort("type")}
        >
          <div className="flex items-center">
            Rodzaj Wizyty
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => handleSort("pet")}
        >
          <div className="flex items-center">
            Zwierzę
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hidden md:table-cell"
          onClick={() => handleSort("client")}
        >
          <div className="flex items-center">
            Właściciel
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hidden md:table-cell"
        >
          Kontynuacja
        </TableHead>
        <TableHead className="text-right">Akcje</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default VisitTableHeader;
