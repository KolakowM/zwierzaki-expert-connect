
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCareProgramById } from "@/services/careProgramService";
import { getPetById } from "@/services/petService";
import { getClientById } from "@/services/clientService";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Printer, CalendarRange, CheckCircle, XCircle, User, PawPrint } from "lucide-react";
import type { CareProgram, Pet, Client } from "@/types";

interface CareProgramDetailsDialogProps {
  programId: string;
  children?: React.ReactNode;
}

const CareProgramDetailsDialog = ({ programId, children }: CareProgramDetailsDialogProps) => {
  const [program, setProgram] = useState<CareProgram | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch care program details when dialog opens
  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!open || !programId) return;
      
      try {
        setLoading(true);
        // Get care program
        const programData = await getCareProgramById(programId);
        if (!programData) {
          toast({
            title: "Błąd",
            description: "Nie udało się pobrać szczegółów planu opieki",
            variant: "destructive"
          });
          setOpen(false);
          return;
        }
        
        setProgram(programData);
        
        // Get associated pet
        const petData = await getPetById(programData.petId);
        if (petData) {
          setPet(petData);
          
          // Get pet owner
          if (petData.clientId) {
            const clientData = await getClientById(petData.clientId);
            if (clientData) {
              setOwner(clientData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
        toast({
          title: "Błąd",
          description: "Wystąpił problem podczas pobierania danych",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgramDetails();
  }, [open, programId, toast]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    return format(typeof dateString === 'string' ? new Date(dateString) : dateString, 'PPP', { locale: pl });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto print:shadow-none print:border-none">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Szczegóły planu opieki</DialogTitle>
            <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
              <Printer className="mr-2 h-4 w-4" />
              Drukuj
            </Button>
          </div>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : program ? (
          <div className="space-y-6">
            {/* Header - Program Name and Status */}
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold">{program.name}</h2>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <CalendarRange className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">
                    {formatDate(program.startDate)}
                    {program.endDate && ` - ${formatDate(program.endDate)}`}
                  </span>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                program.status === "aktywny"
                  ? "bg-green-100 text-green-800"
                  : program.status === "zakończony"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {program.status}
              </div>
            </div>

            {/* Pet and Owner Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PawPrint className="h-5 w-5 mr-2" />
                    Dane zwierzęcia
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {pet ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Imię:</span>
                        <span>{pet.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Gatunek:</span>
                        <span>{pet.species}</span>
                      </div>
                      {pet.breed && (
                        <div className="flex justify-between">
                          <span className="font-medium">Rasa:</span>
                          <span>{pet.breed}</span>
                        </div>
                      )}
                      {pet.age && (
                        <div className="flex justify-between">
                          <span className="font-medium">Wiek:</span>
                          <span>{pet.age} lat</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Dane zwierzęcia niedostępne</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Właściciel
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {owner ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Imię i nazwisko:</span>
                        <span>{owner.firstName} {owner.lastName}</span>
                      </div>
                      {owner.phone && (
                        <div className="flex justify-between">
                          <span className="font-medium">Telefon:</span>
                          <span>{owner.phone}</span>
                        </div>
                      )}
                      {owner.email && (
                        <div className="flex justify-between">
                          <span className="font-medium">Email:</span>
                          <span>{owner.email}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Dane właściciela niedostępne</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle>Plan opieki</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Cel planu:</h4>
                  <p>{program.goal}</p>
                </div>
                
                {program.description && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Opis:</h4>
                    <p className="whitespace-pre-line">{program.description}</p>
                  </div>
                )}
                
                {program.instructions && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Instrukcje:</h4>
                    <p className="whitespace-pre-line">{program.instructions}</p>
                  </div>
                )}
                
                {program.recommendations && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Rekomendacje:</h4>
                    <p className="whitespace-pre-line">{program.recommendations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Footer - Generation info */}
            <div className="text-sm text-muted-foreground pt-4 border-t">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  Plan utworzony: {formatDate(program.createdAt)}
                </div>
                <div>
                  Wygenerowano przez: {user?.email || "Specjalista"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Plan opieki nie został znaleziony</h3>
            <p className="text-muted-foreground mt-1">
              Nie udało się znaleźć planu opieki o podanym identyfikatorze
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CareProgramDetailsDialog;
