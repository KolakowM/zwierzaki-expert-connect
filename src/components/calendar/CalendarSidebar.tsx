
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { isToday, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import { Visit } from "@/types";

interface CalendarSidebarProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onAddAppointment: () => void;
  isLoading: boolean;
  visits: Visit[];
}

const CalendarSidebar = ({ date, onSelectDate, onAddAppointment, isLoading, visits }: CalendarSidebarProps) => {
  // Improved date conversion logic with better error handling
  const isDayWithVisit = (day: Date) => {
    try {
      return visits.some(visit => {
        // Handle both Date objects and string dates safely
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

        // Use date-fns isSameDay for more reliable comparison
        return isSameDay(visitDate, day);
      });
    } catch (error) {
      console.error('Error checking visit date:', error);
      return false;
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Kalendarz</CardTitle>
        <CardDescription>
          Wybierz datę, aby zobaczyć wizyty
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelectDate}
            locale={pl}
            weekStartsOn={1}
            className="rounded-md border-0 pointer-events-auto"
            classNames={{
              day_has_visit: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 font-medium relative after:content-['•'] after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:text-blue-600 after:text-xs",
              day_today: "bg-accent text-accent-foreground font-bold",
            }}
            modifiers={{
              hasVisit: (day) => isDayWithVisit(day),
              today: (day) => isToday(day)
            }}
            modifiersClassNames={{
              hasVisit: "day_has_visit",
              today: "day_today"
            }}
          />
        </div>
        <Button 
          className="w-full" 
          onClick={onAddAppointment}
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Ładowanie...
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              Nowa wizyta
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;
