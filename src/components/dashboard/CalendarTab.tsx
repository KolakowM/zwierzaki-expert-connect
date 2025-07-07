
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { Visit, Client, Pet } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getVisits } from "@/services/visitService";
import { getClients } from "@/services/clientService"; 
import { getPets } from "@/services/petService";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  
  // Fetch data using React Query with better error handling
  const { 
    data: visits = [], 
    isLoading: isLoadingVisits,
    error: visitsError
  } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits,
    retry: 2,
    retryDelay: 1000,
  });

  const { 
    data: clients = [], 
    isLoading: isLoadingClients,
    error: clientsError
  } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    retry: 2,
    retryDelay: 1000,
  });

  const { 
    data: allPets = [], 
    isLoading: isLoadingPets,
    error: petsError
  } = useQuery({
    queryKey: ['pets'],
    queryFn: getPets,
    retry: 2,
    retryDelay: 1000,
  });

  // Improved date filtering with better error handling
  const visitsForSelectedDate = date 
    ? visits.filter(visit => {
        try {
          let visitDate: Date;
          
          if (visit.date instanceof Date) {
            visitDate = visit.date;
          } else if (typeof visit.date === 'string') {
            visitDate = new Date(visit.date);
          } else {
            console.warn('Invalid visit date format:', visit.date);
            return false;
          }

          // Check if visitDate is valid
          if (isNaN(visitDate.getTime())) {
            console.warn('Invalid visit date:', visit.date);
            return false;
          }

          return isSameDay(visitDate, date);
        } catch (error) {
          console.error('Error filtering visit:', error);
          return false;
        }
      })
    : visits;

  // Handle opening the visit details dialog
  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowVisitDetails(true);
  };

  // Show error alerts if any queries failed
  const hasErrors = visitsError || clientsError || petsError;
  
  if (hasErrors) {
    console.error("Errors fetching data:", { visitsError, clientsError, petsError });
  }

  // Determine if we're still loading data
  const isLoading = isLoadingClients || isLoadingPets;

  return (
    <div className="space-y-6">
      {/* Error handling */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Wystąpił problem z pobieraniem danych. Spróbuj odświeżyć stronę.
            {visitsError && " Błąd pobierania wizyt."}
            {clientsError && " Błąd pobierania klientów."}
            {petsError && " Błąd pobierania zwierząt."}
          </AlertDescription>
        </Alert>
      )}

      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar Sidebar - responsive width */}
        <div className="lg:col-span-2">
          <CalendarSidebar 
            date={date}
            onSelectDate={setDate}
            onAddAppointment={() => setShowNewAppointment(true)}
            isLoading={isLoading}
            visits={visits}
          />
        </div>

        {/* Appointments List - responsive width */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Wizyty na {date ? format(date, "dd MMMM yyyy", { locale: pl }) : "wybrany dzień"}
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
                        visitsForSelectedDate.length === 1 ? "wizyta zaplanowana" : 
                        visitsForSelectedDate.length < 5 ? "wizyty zaplanowane" : "wizyt zaplanowanych"
                      }`
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
