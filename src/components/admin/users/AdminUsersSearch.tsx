
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserFormDialog from "@/components/admin/users/UserFormDialog";
import { UserData } from "@/services/userService";

interface AdminUsersSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUserSaved: (user: UserData) => void;
}

const AdminUsersSearch = ({
  searchQuery,
  onSearchChange,
  onUserSaved
}: AdminUsersSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Szukaj użytkowników..."
          className="pl-8 w-full sm:w-[300px]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <UserFormDialog onUserSaved={onUserSaved} />
    </div>
  );
};

export default AdminUsersSearch;
