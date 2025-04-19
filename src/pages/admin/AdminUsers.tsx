
import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import AdminUsersSearch from "@/components/admin/users/AdminUsersSearch";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import { getUsers } from "@/services/user/getUsers";
import { UserData } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("lastLogin");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error: any) {
        console.error("Error loading users:", error);
        toast({
          title: "Błąd podczas ładowania użytkowników",
          description: error.message || "Spróbuj ponownie później",
          variant: "destructive"
        });
        // Set empty array to prevent undefined error
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, [toast]);
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Handle user saved (created or updated)
  const handleUserSaved = (user: UserData) => {
    setUsers(prevUsers => {
      // Check if the user already exists (update case)
      const existingUserIndex = prevUsers.findIndex(u => u.id === user.id);
      
      if (existingUserIndex >= 0) {
        // Update existing user
        const updatedUsers = [...prevUsers];
        updatedUsers[existingUserIndex] = user;
        return updatedUsers;
      } else {
        // Add new user
        return [...prevUsers, user];
      }
    });
  };
  
  // Handle user deleted
  const handleUserDeleted = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };
  
  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valueA, valueB;
      
      if (sortBy === "lastLogin") {
        valueA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        valueB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
      } else {
        valueA = a[sortBy as keyof typeof a] || '';
        valueB = b[sortBy as keyof typeof b] || '';
        
        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
        }
        if (typeof valueB === "string") {
          valueB = valueB.toLowerCase();
        }
      }
      
      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

  return (
    <>
      <AdminHeader 
        title="Zarządzanie Użytkownikami" 
        description="Przeglądaj, dodawaj i zarządzaj użytkownikami systemu"
      />
      
      <Card className="mt-6">
        <AdminUsersSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUserSaved={handleUserSaved}
        />
        
        <AdminUsersTable 
          users={filteredUsers}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onUserSaved={handleUserSaved}
          onUserDeleted={handleUserDeleted}
        />
      </Card>
    </>
  );
};

export default AdminUsers;
