
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Visit, Client, Pet } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getVisits } from "@/services/visitService";
import { getClients } from "@/services/clientService"; 
import { getPets } from "@/services/petService";
import { Loader2 } from "lucide-react";

// Import our newly created components
import CalendarSidebar from "../calendar/CalendarSidebar";
import AppointmentList from "../calendar/AppointmentList";
import AppointmentForm from "../calendar/AppointmentForm";
import VisitDetailsDialog from "../calendar/VisitDetailsDialog";

const CalendarTab = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showVisitDetails, setShowVisitDetails] = useState(false);
  
  // Fetch data using React Query
  const { 
    data: visits = [], 
    isLoading: isLoadingVisits,
    error: visitsError
  } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits,
  });

  const { 
    data: clients = [], 
    isLoading: isLoadingClients,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  const { 
    data: allPets = [], 
    isLoading: isLoadingPets,
  } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
  });

  // Filter visits for the selected date
  const visitsForSelectedDate = date 
    ? visits.filter(visit => {
        const visitDate = new Date(typeof visit.date === 'string' ? visit.date : visit.date);
        return (
          visitDate.getDate() === date.getDate() &&
          visitDate.getMonth() === date.getMonth() &&
          visitDate.getFullYear() === date.getFullYear()
        );
      })
    : [];

  // Find client and pet for a visit
  const getVisitDetails = (visit: Visit) => {
    const client = clients.find(c => c.id === visit.clientId);
    const pet = allPets.find(p => p.id === visit.petId);
    return { client, pet };
  };

  // Handle opening the visit details dialog
  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowVisitDetails(true);
  };

  if (visitsError) {
    console.error("Error fetching visits:", visitsError);
    toast({
      title: "Błąd",
      description: "Nie udało się pobrać danych wizyt",
      variant: "destructive",
    });
  }

  // Determine if we're still loading data
  const isLoading = isLoadingClients || isLoadingPets;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Calendar Sidebar - wider on large screens */}
      <div className="lg:col-span-2">
        <CalendarSidebar 
          date={date}
          onSelectDate={setDate}
          onAddAppointment={() => setShowNewAppointment(true)}
          isLoading={isLoading}
          visits={visits}
        />
      </div>

      {/* Appointments List */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>
              Wizyty na {date ? format(date, "dd.MM.yyyy") : "wybrany dzień"}
            </CardTitle>
            <CardDescription>
              {isLoadingVisits ? (
                <div className="flex items-center">
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Ładowanie wizyt...
                </div>
              ) : (
                visitsForSelectedDate.length > 0
                  ? `${visitsForSelectedDate.length} ${
                      visitsForSelectedDate.length === 1 ? "wizyta" : "wizyty"
                    } zaplanowane`
                  : "Brak wizyt na ten dzień"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
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

      {/* New Appointment Dialog */}
      <AppointmentForm 
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
        selectedDate={date}
        clients={clients}
      />

      {/* Visit Details Dialog */}
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
