
import { Table, TableBody } from "@/components/ui/table";
import { UserData } from "@/services/userService";
import AdminUsersTableHeader from "./AdminUsersTableHeader";
import AdminUsersTableRow from "./AdminUsersTableRow";

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
  onSort,
  onUserSaved,
  onUserDeleted
}: AdminUsersTableProps) => {
  return (
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <AdminUsersTableHeader onSort={onSort} />
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <AdminUsersTableRow
                  key={user.id}
                  user={user}
                  onUserSaved={onUserSaved}
                  onUserDeleted={onUserDeleted}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nie znaleziono użytkowników
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminUsersTable;
