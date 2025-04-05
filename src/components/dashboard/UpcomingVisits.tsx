
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Visit, Pet, Client } from "@/types";
import { Link } from "react-router-dom";

interface UpcomingVisitsProps {
  visits: Visit[];
  pets: Pet[];
  clients: Client[];
}

const UpcomingVisits = ({ visits, pets, clients }: UpcomingVisitsProps) => {
  return (
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
            {visits.map(visit => {
              const pet = pets.find(p => p.id === visit.petId);
              const client = clients.find(c => c.id === visit.clientId);
              return (
                <div key={visit.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{new Date(visit.date).toLocaleDateString('pl-PL')}, {new Date(visit.date).toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className="text-sm text-muted-foreground">{visit.type} - {pet?.name} ({client?.firstName} {client?.lastName})</p>
                  </div>
                  <Button variant="outline" size="sm">Szczegóły</Button>
                </div>
              );
            })}
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
  );
};

export default UpcomingVisits;
