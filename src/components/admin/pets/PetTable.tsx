
import { TableHeader, Table, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Pet } from "@/types";
import ResponsivePetForm from "@/components/pets/ResponsivePetForm";
import { Skeleton } from "@/components/ui/skeleton";

interface PetTableProps {
  pets: Pet[];
  isLoading: boolean;
  handleSort: (column: string) => void;
  handleDelete: (petId: string) => void;
}

const PetTable = ({ pets, isLoading, handleSort, handleDelete }: PetTableProps) => {
  if (isLoading) {
    return (
      <CardContent>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="font-medium p-0"
                onClick={() => handleSort("name")}
              >
                Imię
                <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="font-medium p-0"
                onClick={() => handleSort("species")}
              >
                Gatunek
                <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead>Rasa</TableHead>
            <TableHead className="hidden md:table-cell">Płeć</TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                size="sm"
                className="font-medium p-0"
                onClick={() => handleSort("createdAt")}
              >
                Data dodania
                <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nie znaleziono zwierząt.
              </TableCell>
            </TableRow>
          ) : (
            pets.map((pet) => (
              <TableRow key={pet.id}>
                <TableCell className="font-medium">
                  {pet.name}
                </TableCell>
                <TableCell>{pet.species}</TableCell>
                <TableCell>{pet.breed || "-"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {pet.sex || "-"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(pet.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/pets/${pet.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <ResponsivePetForm
                        clientId={pet.clientId}
                        buttonText=""
                        buttonVariant="ghost"
                        buttonSize="icon"
                        defaultValues={pet}
                        title={`Edytuj: ${pet.name}`}
                        isEditing={true}
                      >
                        <Edit className="h-4 w-4" />
                      </ResponsivePetForm>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(pet.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
};

export default PetTable;
