
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { Visit } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getVisits } from "@/services/visitService";
import { getClients } from "@/services/clientService"; 
import { getPets } from "@/services/petService";

// Import components
import CalendarSidebar from "../calendar/CalendarSidebar";
import AppointmentList from "../calendar/AppointmentList";
import AppointmentForm from "../calendar/AppointmentForm";
import VisitDetailsDialog from "../calendar/VisitDetailsDialog";

const CalendarTab = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showVisitDetails, setShowVisitDetails] = useState(false);
  
  // Fetch data
  const { data: visits = [], isLoading: isLoadingVisits } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const { data: allPets = [] } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });

  // Filter visits for selected date
  const visitsForSelectedDate = date 
    ? visits.filter(visit => {
        try {
          let visitDate: Date;
          
          if (visit.date instanceof Date) {
            visitDate = visit.date;
          } else if (typeof visit.date === 'string') {
            visitDate = new Date(visit.date);
          } else {
            return false;
          }

          if (isNaN(visitDate.getTime())) {
            return false;
          }

          return isSameDay(visitDate, date);
        } catch (error) {
          return false;
        }
      })
    : visits;

  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowVisitDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* 50/50 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
        {/* Calendar Section - 50% */}
        <div className="flex flex-col">
          <CalendarSidebar 
            date={date}
            onSelectDate={setDate}
            onAddAppointment={() => setShowNewAppointment(true)}
          />
        </div>

        {/* Appointments Section - 50% */}
        <div className="flex flex-col">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                Wizyty na {date ? format(date, "dd MMMM yyyy", { locale: pl }) : "wybrany dzień"}
              </CardTitle>
              <CardDescription>
                {visitsForSelectedDate.length > 0
                  ? `${visitsForSelectedDate.length} ${
                      visitsForSelectedDate.length === 1 ? "wizyta zaplanowana" : 
                      visitsForSelectedDate.length < 5 ? "wizyty zaplanowane" : "wizyt zaplanowanych"
                    }`
                  : "Brak wizyt na ten dzień"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <AppointmentList 
                isLoading={isLoadingVisits}
                appointments={visitsForSelectedDate}
                onAppointmentClick={handleVisitClick}
                onAddAppointment={() => setShowNewAppointment(true)}
                clients={clients}
                pets={allPets}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AppointmentForm 
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
        selectedDate={date}
        clients={clients}
      />

      {selectedVisit && (
        <VisitDetailsDialog 
          isOpen={showVisitDetails}
          onClose={() => setShowVisitDetails(false)}
          visit={selectedVisit}
          client={clients.find(c => c.id === selectedVisit.clientId)}
          pet={allPets.find(p => p.id === selectedVisit.petId)}
        />
      )}
    </div>
  );
};

export default CalendarTab;
