
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCareProgramById } from "@/services/careProgramService";
import { getPetById } from "@/services/petService";
import { getClientById } from "@/services/clientService";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Printer, User, PawPrint, XCircle } from "lucide-react";
import type { CareProgram, Pet, Client } from "@/types";
import ProgramHeader from "./details/ProgramHeader";
import EntityInfoCard from "./details/EntityInfoCard";
import ProgramDetailsCard from "./details/ProgramDetailsCard";

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
            <ProgramHeader program={program} formatDate={formatDate} />

            {/* Pet and Owner Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EntityInfoCard 
                title="Dane zwierzęcia" 
                Icon={PawPrint}
                infoItems={[
                  { label: "Imię", value: pet?.name },
                  { label: "Gatunek", value: pet?.species },
                  { label: "Rasa", value: pet?.breed },
                  { label: "Wiek", value: pet?.age ? `${pet.age} lat` : undefined }
                ]}
                emptyMessage="Dane zwierzęcia niedostępne"
              />
              
              <EntityInfoCard 
                title="Właściciel" 
                Icon={User}
                infoItems={[
                  { label: "Imię i nazwisko", value: owner ? `${owner.firstName} ${owner.lastName}` : undefined },
                  { label: "Telefon", value: owner?.phone },
                  { label: "Email", value: owner?.email }
                ]}
                emptyMessage="Dane właściciela niedostępne"
              />
            </div>
            
            {/* Plan Details */}
            <ProgramDetailsCard program={program} />
            
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
