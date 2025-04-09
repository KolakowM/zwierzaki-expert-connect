
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCareProgramsByPetId, deleteCareProgram } from "@/services/careProgramService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CareProgram } from "@/types";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarRange, Pencil, Eye, ListPlus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ResponsiveCareProgramForm from "@/components/care-programs/ResponsiveCareProgramForm";
import { useToast } from "@/hooks/use-toast";
import CareProgramDetailsDialog from "./CareProgramDetailsDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface PetCareProgramsProps {
  petId: string;
}

const PetCarePrograms = ({ petId }: PetCareProgramsProps) => {
  const { data: carePrograms = [], isLoading } = useQuery({
    queryKey: ['carePrograms', petId],
    queryFn: () => getCareProgramsByPetId(petId),
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleCareProgramSaved = () => {
    queryClient.invalidateQueries({ queryKey: ['carePrograms', petId] });
    // No need to show a toast here as it's already shown in the form components
  };
  
  const handleDeleteProgram = async (programId: string) => {
    try {
      await deleteCareProgram(programId);
      queryClient.invalidateQueries({ queryKey: ['carePrograms', petId] });
      toast({
        title: "Program usunięty",
        description: "Program opieki został pomyślnie usunięty"
      });
    } catch (error) {
      console.error("Error deleting care program:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć programu opieki",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Programy Opieki</CardTitle>
        <ResponsiveCareProgramForm 
          petId={petId}
          buttonText="Dodaj Program"
          buttonSize="sm"
          buttonVariant="default"
          onCareProgramSaved={handleCareProgramSaved}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : carePrograms.length > 0 ? (
          <div className="space-y-4">
            {carePrograms.map((program) => (
              <CareProgram 
                key={program.id} 
                program={program} 
                onCareProgramSaved={handleCareProgramSaved} 
                onDelete={handleDeleteProgram}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md border-dashed">
            <ListPlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Brak programów opieki</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Dodaj pierwszy program opieki dla tego zwierzęcia
            </p>
            <ResponsiveCareProgramForm
              petId={petId}
              buttonText="Dodaj pierwszy program opieki"
              onCareProgramSaved={handleCareProgramSaved}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CareProgram = ({ 
  program, 
  onCareProgramSaved,
  onDelete
}: { 
  program: CareProgram;
  onCareProgramSaved: () => void;
  onDelete: (id: string) => Promise<void>;
}) => {
  // Function to get status badge based on status value
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aktywny':
        return <Badge className="bg-green-500">Aktywny</Badge>;
      case 'zakończony':
        return <Badge className="bg-blue-500">Zakończony</Badge>;
      case 'planowany':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Planowany</Badge>;
      case 'wstrzymany':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Wstrzymany</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{program.name}</h3>
              <div className="ml-2">
                {getStatusBadge(program.status)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{program.goal}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <CalendarRange className="h-3 w-3 mr-1" />
              <span>
                {format(new Date(program.startDate), 'PPP', { locale: pl })}
                {program.endDate && ` - ${format(new Date(program.endDate), 'PPP', { locale: pl })}`}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <CareProgramDetailsDialog programId={program.id}>
              <Button size="icon" variant="ghost">
                <Eye className="h-4 w-4" />
              </Button>
            </CareProgramDetailsDialog>
            
            <ResponsiveCareProgramForm
              petId={program.petId}
              isEditing={true}
              defaultValues={program}
              onCareProgramSaved={onCareProgramSaved}
              buttonVariant="ghost"
              buttonSize="icon"
            >
              <Button size="icon" variant="ghost">
                <Pencil className="h-4 w-4" />
              </Button>
            </ResponsiveCareProgramForm>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Usunąć program opieki?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ta akcja nie może zostać cofnięta. Program opieki "{program.name}" zostanie trwale usunięty.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anuluj</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(program.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Usuń
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCarePrograms;
