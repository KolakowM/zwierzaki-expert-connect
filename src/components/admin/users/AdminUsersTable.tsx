
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpDown, 
  User,
  Shield, 
  Mail,
  Calendar
} from "lucide-react";
import UserFormDialog from "@/components/admin/users/UserFormDialog";
import DeleteUserButton from "@/components/admin/users/DeleteUserButton";
import { UserData } from "@/services/userService";

interface AdminUsersTableProps {
  users: UserData[];
  isLoading: boolean;
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
  onUserSaved: (user: UserData) => void;
  onUserDeleted: (userId: string) => void;
}

const AdminUsersTable = ({
  users,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onUserSaved,
  onUserDeleted
}: AdminUsersTableProps) => {
  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nigdy";
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="success">Aktywny</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Nieaktywny</Badge>;
      case 'pending':
        return <Badge variant="warning">Oczekujący</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get role badge
  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return (
          <div className="flex items-center">
            <Shield className="mr-1 h-3 w-3 text-red-500" />
            <span>Administrator</span>
          </div>
        );
      case 'specialist':
        return (
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3 text-blue-500" />
            <span>Specjalista</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3 text-gray-500" />
            <span>Użytkownik</span>
          </div>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
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
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(user.lastLogin)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <UserFormDialog 
                        user={user} 
                        isEditing={true} 
                        onUserSaved={onUserSaved}
                      />
                      <DeleteUserButton 
                        userId={user.id} 
                        userName={user.name}
                        onUserDeleted={() => onUserDeleted(user.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nie znaleziono użytkowników
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminUsersTable;
