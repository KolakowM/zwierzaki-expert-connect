
import { CalendarIcon, Loader2 } from "lucide-react";
import { Visit } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface AppointmentListProps {
  isLoading: boolean;
  appointments: Visit[];
  onAppointmentClick: (appointment: Visit) => void;
  onAddAppointment: () => void;
}

const AppointmentList = ({ 
  isLoading, 
  appointments, 
  onAppointmentClick, 
  onAddAppointment 
}: AppointmentListProps) => {
  // Helper function to format date that handles both string and Date objects
  const formatVisitDate = (dateValue: string | Date) => {
    return format(typeof dateValue === 'string' ? new Date(dateValue) : dateValue, "HH:mm");
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
          
          return (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => onAppointmentClick(appointment)}
            >
              <div>
                <p className="font-medium">{visitTime} - {appointment.type}</p>
                <p className="text-sm text-muted-foreground">
                  {/* Client and pet names will be passed from parent component */}
                  {appointment.notes ? appointment.notes.substring(0, 30) + (appointment.notes.length > 30 ? '...' : '') : 'Brak notatek'}
                </p>
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
