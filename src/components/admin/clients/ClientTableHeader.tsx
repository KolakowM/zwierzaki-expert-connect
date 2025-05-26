
import { ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ClientTableHeaderProps {
  handleSort: (column: string) => void;
}

const ClientTableHeader = ({ handleSort }: ClientTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="w-[200px] cursor-pointer"
          onClick={() => handleSort("name")}
        >
          <div className="flex items-center">
            Imię i Nazwisko
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => handleSort("email")}
        >
          <div className="flex items-center">
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => handleSort("phone")}
        >
          <div className="flex items-center">
            Telefon
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hidden md:table-cell"
          onClick={() => handleSort("city")}
        >
          <div className="flex items-center">
            Miasto
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hidden md:table-cell"
          onClick={() => handleSort("createdAt")}
        >
          <div className="flex items-center">
            Data Utworzenia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-right">Akcje</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ClientTableHeader;
