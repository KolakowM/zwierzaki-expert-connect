
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
  PlusCircle, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  UserPlus
} from "lucide-react";

// Dummy users data for demonstration
const usersData = [
  { 
    id: "1", 
    firstName: "Jan", 
    lastName: "Kowalski", 
    email: "jan.kowalski@example.com", 
    role: "admin",
    status: "active",
    createdAt: "2023-01-15"
  },
  { 
    id: "2", 
    firstName: "Anna", 
    lastName: "Nowak", 
    email: "anna.nowak@example.com", 
    role: "specialist",
    status: "active",
    createdAt: "2023-02-20"
  },
  { 
    id: "3", 
    firstName: "Piotr", 
    lastName: "Wiśniewski", 
    email: "piotr.wisniewski@example.com", 
    role: "specialist",
    status: "inactive",
    createdAt: "2023-03-10"
  },
  { 
    id: "4", 
    firstName: "Maria", 
    lastName: "Lewandowska", 
    email: "maria.lewandowska@example.com", 
    role: "specialist",
    status: "active",
    createdAt: "2023-04-05"
  },
  { 
    id: "5", 
    firstName: "Krzysztof", 
    lastName: "Kowalczyk", 
    email: "krzysztof.kowalczyk@example.com", 
    role: "specialist",
    status: "active",
    createdAt: "2023-05-12"
  },
];

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Filter and sort users
  const filteredUsers = usersData
    .filter(user => 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valueA, valueB;
      
      if (sortBy === "name") {
        valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else {
        valueA = a[sortBy as keyof typeof a];
        valueB = b[sortBy as keyof typeof b];
        
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
        description="Przeglądaj, dodawaj i zarządzaj użytkownikami platformy"
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
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center">
                    Rola
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
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
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                        {user.role === "admin" ? "Administrator" : "Specjalista"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "outline" : "secondary"}>
                        {user.status === "active" ? "Aktywny" : "Nieaktywny"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
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
