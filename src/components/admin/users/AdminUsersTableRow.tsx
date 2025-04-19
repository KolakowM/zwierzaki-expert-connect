
import { TableCell, TableRow } from "@/components/ui/table";
import { Mail, Calendar } from "lucide-react";
import { UserData } from "@/services/userService";
import UserFormDialog from "./UserFormDialog";
import DeleteUserButton from "./DeleteUserButton";
import { formatDate, getRoleBadge, getStatusBadge } from "./utils/userTableUtils";

interface AdminUsersTableRowProps {
  user: UserData;
  onUserSaved: (user: UserData) => void;
  onUserDeleted: (userId: string) => void;
}

const AdminUsersTableRow = ({ user, onUserSaved, onUserDeleted }: AdminUsersTableRowProps) => {
  return (
    <TableRow>
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
  );
};

export default AdminUsersTableRow;
