
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Edit, 
  Trash2, 
  ArrowUpDown, 
  User,
  UserPlus, 
  Shield, 
  Mail,
  Calendar
} from "lucide-react";

// Mock data for illustration, would come from API in real implementation
const mockUsers = [
  {
    id: "1",
    name: "Anna Kowalska",
    email: "anna.kowalska@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-04-05T12:00:00Z"
  },
  {
    id: "2",
    name: "Jan Nowak",
    email: "jan.nowak@example.com",
    role: "specialist",
    status: "active",
    lastLogin: "2023-04-03T14:30:00Z"
  },
  {
    id: "3",
    name: "Maria Wiśniewska",
    email: "maria.wisniewska@example.com",
    role: "specialist",
    status: "inactive",
    lastLogin: "2023-03-25T09:15:00Z"
  },
  {
    id: "4",
    name: "Piotr Dąbrowski",
    email: "piotr.dabrowski@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-04-04T16:45:00Z"
  },
  {
    id: "5",
    name: "Aleksandra Lewandowska",
    email: "aleksandra.lewandowska@example.com",
    role: "user",
    status: "pending",
    lastLogin: null
  },
];

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("lastLogin");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Filter and sort users
  const filteredUsers = mockUsers
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
  
  // Format date
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
    <>
      <AdminHeader 
        title="Zarządzanie Użytkownikami" 
        description="Przeglądaj, dodawaj i zarządzaj użytkownikami systemu"
      />
      
      <Card className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj użytkowników..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Dodaj Użytkownika
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[250px] cursor-pointer"
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
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center">
                    Rola
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden lg:table-cell"
                  onClick={() => handleSort("lastLogin")}
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
        </div>
      </Card>
    </>
  );
};

export default AdminUsers;
