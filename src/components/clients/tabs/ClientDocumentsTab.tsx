
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarRange, FileText, Plus } from "lucide-react";
import { Client, Pet, CareProgram } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPetsByClientId } from "@/services/petService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import ResponsiveCareProgramForm from "@/components/care-programs/ResponsiveCareProgramForm";
import CareProgramDetailsDialog from "@/components/care-programs/CareProgramDetailsDialog";

interface ClientDocumentsTabProps {
  client: Client;
}

const ClientDocumentsTab = ({ client }: ClientDocumentsTabProps) => {
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const { data: pets = [], isLoading: petsLoading } = useQuery({
    queryKey: ['pets', client.id],
    queryFn: () => getPetsByClientId(client.id),
    enabled: !!client.id,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all care programs for all pets of this client
  const { data: allCarePrograms = [], isLoading: programsLoading } = useQuery({
    queryKey: ['clientCarePrograms', client.id],
    queryFn: async () => {
      if (!client.id) return [];
      
      // Get all pets for this client
      const clientPets = await getPetsByClientId(client.id);
      if (clientPets.length === 0) return [];
      
      // Use local cache to avoid redundant queries
      let allPrograms: CareProgram[] = [];
      
      for (const pet of clientPets) {
        // Try to get programs from the cache
        const cachedPrograms = queryClient.getQueryData<CareProgram[]>(['carePrograms', pet.id]);
        
        if (cachedPrograms) {
          allPrograms = [...allPrograms, ...cachedPrograms];
        }
      }
      
      return allPrograms;
    },
    enabled: !!client.id && pets.length > 0,
  });

  const isLoading = petsLoading || programsLoading;
  
  const handleProgramSelect = (petId: string) => {
    setSelectedPetId(petId);
  };

  const handleProgramSaved = (program: CareProgram) => {
    queryClient.invalidateQueries({ queryKey: ['carePrograms', program.petId] });
    queryClient.invalidateQueries({ queryKey: ['clientCarePrograms', client.id] });
    toast({
      title: "Program opieki zapisany",
      description: "Program opieki został pomyślnie zapisany",
    });
  };

  // Format date function
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), 'PPP', { locale: pl });
  };

  // Get status badge
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

  // Get pet name by ID
  const getPetName = (petId: string): string => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : "Nieznane zwierzę";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Programy opieki</CardTitle>
          <CardDescription>
            Programy opieki dla zwierząt tego klienta
          </CardDescription>
        </div>
        {pets.length > 0 && (
          <div className="flex gap-2">
            <select 
              className="border rounded px-2 py-1 text-sm"
              value={selectedPetId}
              onChange={(e) => handleProgramSelect(e.target.value)}
            >
              <option value="">Wybierz zwierzę</option>
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>{pet.name}</option>
              ))}
            </select>
            {selectedPetId && (
              <ResponsiveCareProgramForm
                petId={selectedPetId}
                buttonText="Dodaj program"
                buttonSize="sm"
                onCareProgramSaved={handleProgramSaved}
              />
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : allCarePrograms.length > 0 ? (
          <div className="space-y-4">
            {allCarePrograms.map(program => (
              <Card key={program.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{program.name}</h3>
                        <div className="ml-2">
                          {getStatusBadge(program.status)}
                        </div>
                      </div>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Zwierzę: </span>
                        <span className="font-medium">{getPetName(program.petId)}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{program.goal}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <CalendarRange className="h-3 w-3 mr-1" />
                        <span>
                          {formatDate(program.startDate)}
                          {program.endDate && ` - ${formatDate(program.endDate)}`}
                        </span>
                      </div>
                    </div>
                    <div>
                      <CareProgramDetailsDialog programId={program.id}>
                        <Button size="sm" variant="outline">Szczegóły</Button>
                      </CareProgramDetailsDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-2 text-lg font-medium">Brak programów opieki</h3>
            {pets.length > 0 ? (
              <p className="text-muted-foreground mt-1">
                Żadne ze zwierząt tego klienta nie ma jeszcze przypisanego programu opieki
              </p>
            ) : (
              <p className="text-muted-foreground mt-1">
                Ten klient nie ma jeszcze dodanych zwierząt
              </p>
            )}
            {pets.length > 0 && (
              <div className="mt-4">
                <select 
                  className="border rounded px-2 py-2 mr-2 text-sm"
                  value={selectedPetId}
                  onChange={(e) => handleProgramSelect(e.target.value)}
                >
                  <option value="">Wybierz zwierzę</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
                {selectedPetId && (
                  <ResponsiveCareProgramForm
                    petId={selectedPetId}
                    buttonText="Utwórz nowy program opieki"
                    onCareProgramSaved={handleProgramSaved}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientDocumentsTab;
