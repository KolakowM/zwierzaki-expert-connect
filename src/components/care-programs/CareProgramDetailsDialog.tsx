
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CareProgram } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getCareProgramById } from "@/services/careProgramService";
import { getPetById } from "@/services/petService";
import { getClientById } from "@/services/clientService";
import { CalendarRange, User, InfoIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";

interface CareProgramDetailsDialogProps {
  programId: string;
  children?: React.ReactNode;
}

const CareProgramDetailsDialog = ({ programId, children }: CareProgramDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const { data: program, isLoading: isProgramLoading } = useQuery({
    queryKey: ['careProgram', programId],
    queryFn: () => getCareProgramById(programId),
    enabled: open,
  });
  
  const { data: pet, isLoading: isPetLoading } = useQuery({
    queryKey: ['pet', program?.petId],
    queryFn: () => getPetById(program?.petId || ''),
    enabled: open && !!program?.petId,
  });
  
  const { data: client, isLoading: isClientLoading } = useQuery({
    queryKey: ['client', pet?.clientId],
    queryFn: () => getClientById(pet?.clientId || ''),
    enabled: open && !!pet?.clientId,
  });
  
  const isLoading = isProgramLoading || isPetLoading || isClientLoading;
  
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
  
  const formatDateRange = () => {
    if (!program) return "";
    
    const start = new Date(program.startDate);
    let result = format(start, 'PPP', { locale: pl });
    
    if (program.endDate) {
      const end = new Date(program.endDate);
      result += ` - ${format(end, 'PPP', { locale: pl })}`; 
    }
    
    return result;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <InfoIcon className="mr-2 h-4 w-4" /> Szczegóły
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : program ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{program.name}</DialogTitle>
                {getStatusBadge(program.status)}
              </div>
              <DialogDescription>
                <div className="flex items-center text-sm mt-2">
                  <CalendarRange className="h-4 w-4 mr-1" />
                  {formatDateRange()}
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              {/* Pet and Client Information */}
              <Card className="border-muted">
                <CardContent className="p-4 space-y-3">
                  {pet && (
                    <div className="flex flex-col">
                      <h4 className="text-sm font-medium">Zwierzę:</h4>
                      <p>{pet.name} ({pet.species}{pet.breed ? `, ${pet.breed}` : ''})</p>
                    </div>
                  )}
                  
                  {client && (
                    <div className="flex flex-col">
                      <h4 className="text-sm font-medium">Właściciel:</h4>
                      <p>{client.firstName} {client.lastName}</p>
                      {client.phone && <p className="text-sm text-muted-foreground">Tel: {client.phone}</p>}
                      {client.email && <p className="text-sm text-muted-foreground">Email: {client.email}</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Program Details */}
              <div>
                <h3 className="font-medium mb-2">Cel programu</h3>
                <p className="mb-4 text-sm">{program.goal}</p>
                
                {program.description && (
                  <>
                    <h3 className="font-medium mb-2">Opis</h3>
                    <p className="mb-4 text-sm">{program.description}</p>
                  </>
                )}
                
                {program.instructions && (
                  <>
                    <h3 className="font-medium mb-2">Instrukcje</h3>
                    <p className="mb-4 text-sm">{program.instructions}</p>
                  </>
                )}
                
                {program.recommendations && (
                  <>
                    <h3 className="font-medium mb-2">Zalecenia</h3>
                    <p className="mb-4 text-sm">{program.recommendations}</p>
                  </>
                )}
              </div>
              
              <Separator />
              
              {/* Footer with metadata */}
              <div className="text-xs text-muted-foreground">
                <div className="flex flex-col">
                  <p>Data wygenerowania: {format(new Date(), 'PPP, HH:mm', { locale: pl })}</p>
                  {user && (
                    <p className="mt-1">Wygenerowane przez: {user.email}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p>Nie znaleziono programu opieki</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CareProgramDetailsDialog;
