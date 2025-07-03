
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { isToday } from "date-fns";
import { Visit } from "@/types";

interface CalendarSidebarProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onAddAppointment: () => void;
  isLoading: boolean;
  visits: Visit[];
}

const CalendarSidebar = ({ date, onSelectDate, onAddAppointment, isLoading, visits }: CalendarSidebarProps) => {
  // Mark days with visits
  const isDayWithVisit = (day: Date) => {
    return visits.some(visit => {
      const visitDate = new Date(typeof visit.date === 'string' ? visit.date : visit.date);
      return (
        visitDate.getDate() === day.getDate() &&
        visitDate.getMonth() === day.getMonth() &&
        visitDate.getFullYear() === day.getFullYear()
      );
    });
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
            className="rounded-md border-0"
            modifiers={{
              hasVisit: (day) => isDayWithVisit(day),
              today: (day) => isToday(day)
            }}
            modifiersStyles={{
              hasVisit: { 
                fontWeight: "bold", 
                textDecoration: "underline",
                color: "hsl(var(--primary))"
              },
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
