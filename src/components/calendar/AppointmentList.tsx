
import { CalendarIcon, Loader2 } from "lucide-react";
import { Visit, Client, Pet } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface AppointmentListProps {
  isLoading: boolean;
  appointments: Visit[];
  onAppointmentClick: (appointment: Visit) => void;
  onAddAppointment: () => void;
  clients: Client[];
  pets: Pet[];
}

const AppointmentList = ({ 
  isLoading, 
  appointments, 
  onAppointmentClick, 
  onAddAppointment,
  clients,
  pets
}: AppointmentListProps) => {
  // Helper function to format date that handles both string and Date objects
  const formatVisitDate = (dateValue: string | Date) => {
    return format(typeof dateValue === 'string' ? new Date(dateValue) : dateValue, "HH:mm");
  };

  // Helper function to get client and pet details for a visit
  const getVisitDetails = (visit: Visit) => {
    const client = clients.find(c => c.id === visit.clientId);
    const pet = pets.find(p => p.id === visit.petId);
    return { client, pet };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 size={28} className="animate-spin mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Ładowanie danych wizyt</p>
      </div>
    );
  }

  if (appointments.length > 0) {
    return (
      <div className="space-y-4">
        {appointments.map((appointment) => {
          const visitTime = appointment.time || formatVisitDate(appointment.date);
          const { client, pet } = getVisitDetails(appointment);
          
          return (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => onAppointmentClick(appointment)}
            >
              <div className="flex-1">
                <p className="font-medium">{visitTime} - {appointment.type}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  {client && (
                    <p>Klient: {client.firstName} {client.lastName}</p>
                  )}
                  {pet && (
                    <p>Zwierzę: {pet.name} ({pet.species})</p>
                  )}
                  {appointment.notes && (
                    <p className="italic">
                      {appointment.notes.length > 50 
                        ? appointment.notes.substring(0, 50) + '...' 
                        : appointment.notes
                      }
                    </p>
                  )}
                </div>
              </div>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-40 border border-dashed rounded-md">
      <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        Brak wizyt na ten dzień
      </p>
      <Button 
        variant="link" 
        onClick={onAddAppointment}
      >
        Dodaj wizytę
      </Button>
    </div>
  );
};

export default AppointmentList;
