import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getPets, deletePet, getRelatedEntitiesCount } from "@/services/petService";
import PetSearchBar from "@/components/admin/pets/PetSearchBar";
import PetTable from "@/components/admin/pets/PetTable";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteWarning {
  title: string;
  message: string;
  details: { label: string; count: number; }[];
}

const AdminPets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<DeleteWarning | null>(null);
  const { toast } = useToast();
  
  const { data: pets = [], isLoading, refetch } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  
  const onPetDeleted = () => {
    refetch();
  };
  
  // Filter and sort pets
  const filteredPets = pets
    .filter(pet => 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let valueA, valueB;
      
      if (sortBy === "name") {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
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

  const handleDelete = async (petId: string) => {
    try {
      setIsDeleting(true);
      
      // Check for related entities
      const relatedEntities = await getRelatedEntitiesCount(petId);
      
      // If there are related entities, show a warning dialog
      if (relatedEntities.visits > 0 || relatedEntities.carePrograms > 0) {
        setSelectedPetId(petId);
        setDeleteWarning({
          title: "Zwierzę ma powiązane dane",
          message: "To zwierzę ma powiązane wizyty lub programy opieki. Wszystkie powiązane dane zostaną usunięte.",
          details: [
            {
              label: "Liczba powiązanych wizyt",
              count: relatedEntities.visits
            },
            {
              label: "Liczba powiązanych programów opieki",
              count: relatedEntities.carePrograms
            }
          ]
        });
        setShowDeleteWarning(true);
        setIsDeleting(false);
        return;
      }
      
      await deletePet(petId);
      
      toast({
        title: "Zwierzę usunięte",
        description: "Zwierzę zostało pomyślnie usunięte z systemu"
      });
      
      // Refresh the pet list
      if (onPetDeleted) {
        onPetDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting pet:", error);
      toast({
        title: "Błąd usuwania",
        description: error.message || "Wystąpił błąd podczas usuwania zwierzęcia",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePet(selectedPetId!);
      
      toast({
        title: "Zwierzę usunięte",
        description: "Zwierzę zostało pomyślnie usunięte z systemu"
      });
      
      // Refresh the pet list
      if (onPetDeleted) {
        onPetDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting pet:", error);
      toast({
        title: "Błąd usuwania",
        description: error.message || "Wystąpił błąd podczas usuwania zwierzęcia",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteWarning(false);
    }
  };

  return (
    <>
      <AdminHeader 
        title="Zarządzanie Zwierzętami" 
        description="Przeglądaj i zarządzaj zwierzętami w systemie"
      />
      
      <Card className="mt-6">
        <PetSearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <PetTable 
          pets={filteredPets} 
          isLoading={isLoading} 
          handleSort={handleSort}
          handleDelete={handleDelete}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteWarning?.title || "Potwierdź usunięcie"}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteWarning?.message || "Czy na pewno chcesz usunąć to zwierzę?"}
              {deleteWarning?.details && (
                <ul className="mt-2">
                  {deleteWarning.details.map((detail, index) => (
                    <li key={index}>
                      {detail.label}: {detail.count}
                    </li>
                  ))}
                </ul>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setShowDeleteWarning(false)}>
              Anuluj
            </AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={confirmDelete}>
              {isDeleting ? "Usuwanie..." : "Usuń"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminPets;
