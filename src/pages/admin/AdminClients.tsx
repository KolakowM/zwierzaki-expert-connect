
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
import { 
  Search, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  Eye,
  UserPlus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Link } from "react-router-dom";

const AdminClients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  // Filter and sort clients
  const filteredClients = clients
    .filter(client => 
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone && client.phone.includes(searchQuery))
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valueA, valueB;
      
      if (sortBy === "name") {
        valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortBy === 'createdAt') {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
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
        title="Zarządzanie Klientami" 
        description="Przeglądaj, dodawaj i zarządzaj klientami platformy"
      />
      
      <Card className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj klientów..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Dodaj Klienta
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
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.city || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/clients/${client.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
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
                    Nie znaleziono klientów
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

export default AdminClients;
