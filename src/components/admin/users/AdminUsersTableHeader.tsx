
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface AdminUsersTableHeaderProps {
  onSort: (column: string) => void;
}

const AdminUsersTableHeader = ({ onSort }: AdminUsersTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="w-[250px] cursor-pointer"
          onClick={() => onSort("name")}
        >
          <div className="flex items-center">
            Imię i Nazwisko
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer"
          onClick={() => onSort("email")}
        >
          <div className="flex items-center">
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hidden md:table-cell"
          onClick={() => onSort("role")}
        >
          <div className="flex items-center">
            Rola
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hidden md:table-cell"
          onClick={() => onSort("status")}
        >
          <div className="flex items-center">
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hidden lg:table-cell"
          onClick={() => onSort("lastLogin")}
        >
          <div className="flex items-center">
            Ostatnie Logowanie
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-right">Akcje</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AdminUsersTableHeader;
