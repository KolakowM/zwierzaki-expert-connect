
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCareProgramsByPetId } from "@/services/careProgramService";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CareProgram } from "@/types";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarRange, Pencil, Eye, ListPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ResponsiveCareProgramForm from "@/components/care-programs/ResponsiveCareProgramForm";
import { useToast } from "@/hooks/use-toast";
import CareProgramDetailsDialog from "./CareProgramDetailsDialog";

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
    toast({
      title: "Program opieki zapisany",
      description: "Program opieki został pomyślnie zapisany."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'aktywny':
        return <Badge className="bg-green-500">Aktywny</Badge>;
      case 'completed':
      case 'zakończony':
        return <Badge className="bg-blue-500">Zakończony</Badge>;
      case 'paused':
      case 'wstrzymany':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Wstrzymany</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        >
          <Button size="sm">
            <ListPlus className="mr-2 h-4 w-4" />
            Dodaj Program
          </Button>
        </ResponsiveCareProgramForm>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : carePrograms.length > 0 ? (
          <div className="space-y-4">
            {carePrograms.map((program) => (
              <CareProgram key={program.id} program={program} onCareProgramSaved={handleCareProgramSaved} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md border-dashed">
            <ListPlus className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Brak programów opieki</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Dodaj pierwszy program opieki dla tego zwierzęcia
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CareProgram = ({ 
  program, 
  onCareProgramSaved 
}: { 
  program: CareProgram; 
  onCareProgramSaved: () => void;
}) => {
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCarePrograms;
