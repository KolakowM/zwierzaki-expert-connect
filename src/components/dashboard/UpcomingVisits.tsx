
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Visit, Pet, Client } from "@/types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface UpcomingVisitsProps {
  visits: Visit[];
  pets: Pet[];
  clients: Client[];
}

const UpcomingVisits = ({ visits, pets, clients }: UpcomingVisitsProps) => {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  
  // Find the pet and client for a visit
  const getPet = (petId: string) => pets.find(p => p.id === petId);
  const getClient = (clientId: string) => clients.find(c => c.id === clientId);
  
  // Sort visits by date (ascending - nearest first) and limit to 5
  const sortedVisits = [...visits]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  const hasMoreVisits = visits.length > 5;
  
  const handleOpenVisitDetails = (visit: Visit) => {
    setSelectedVisit(visit);
  };
  
  const handleCloseVisitDetails = () => {
    setSelectedVisit(null);
  };

  const formatVisitDateTime = (visit: Visit) => {
    const visitDate = new Date(visit.date);
    const dateStr = visitDate.toLocaleDateString('pl-PL');
    
    // Use the time field if available, otherwise extract from date
    let timeStr = "00:00";
    if (visit.time) {
      timeStr = visit.time;
    } else {
      // Extract time from the date object
      timeStr = visitDate.toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'});
    }
    
    return `${dateStr}, ${timeStr}`;
  };
  
  return (
    <>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Nadchodzące wizyty</CardTitle>
          <CardDescription>
            {visits.length > 0 
              ? 'Twoje najbliższe zaplanowane wizyty' 
              : 'Nie masz zaplanowanych wizyt na ten tydzień'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visits.length > 0 ? (
            <div className="space-y-4">
              {sortedVisits.map(visit => {
                const pet = getPet(visit.petId);
                const client = getClient(visit.clientId);
                return (
                  <div key={visit.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{formatVisitDateTime(visit)}</p>
                      <p className="text-sm text-muted-foreground">{visit.type} - {pet?.name} ({client?.firstName} {client?.lastName})</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleOpenVisitDetails(visit)}>
                      Szczegóły
                    </Button>
                  </div>
                );
              })}
              {hasMoreVisits && (
                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    i {visits.length - 5} więcej...
                  </p>
                  <Link to="/dashboard?tab=calendar">
                    <Button variant="link" size="sm">
                      Zobacz wszystkie
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
              <div className="flex flex-col items-center justify-center text-center p-4">
                <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Kliknij "Kalendarz", aby zaplanować nową wizytę</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Visit Details Dialog */}
      <Dialog open={!!selectedVisit} onOpenChange={(open) => !open && handleCloseVisitDetails()}>
        {selectedVisit && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Szczegóły wizyty</DialogTitle>
              <DialogDescription>
                {formatVisitDateTime(selectedVisit)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-medium">Typ wizyty</h4>
                <p>{selectedVisit.type}</p>
              </div>
              
              {(() => {
                const pet = getPet(selectedVisit.petId);
                const client = getClient(selectedVisit.clientId);
                return (
                  <>
                    <div>
                      <h4 className="font-medium">Zwierzak</h4>
                      <p>{pet?.name} ({pet?.species}, {pet?.breed})</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Klient</h4>
                      <p>{client?.firstName} {client?.lastName}</p>
                    </div>
                  </>
                );
              })()}
              
              {selectedVisit.notes && (
                <div>
                  <h4 className="font-medium">Notatki</h4>
                  <p>{selectedVisit.notes}</p>
                </div>
              )}
              
              {selectedVisit.recommendations && (
                <div>
                  <h4 className="font-medium">Zalecenia</h4>
                  <p>{selectedVisit.recommendations}</p>
                </div>
              )}
              
              {selectedVisit.followUpNeeded && (
                <div>
                  <h4 className="font-medium">Wymagana wizyta kontrolna</h4>
                  <p>
                    {selectedVisit.followUpDate 
                      ? `Zaplanowana na: ${new Date(selectedVisit.followUpDate).toLocaleDateString('pl-PL')}` 
                      : 'Tak'}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseVisitDetails}>
                Zamknij
              </Button>
              <Link to={`/clients/${selectedVisit.clientId}`}>
                <Button>Profil klienta</Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default UpcomingVisits;
