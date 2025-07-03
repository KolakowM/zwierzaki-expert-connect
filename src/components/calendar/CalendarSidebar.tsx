
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
            className="rounded-md border-0 w-full max-w-none"
            classNames={{
              months: "flex flex-col space-y-4 w-full",
              month: "space-y-4 w-full",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] text-center",
              row: "flex w-full mt-2",
              cell: "flex-1 h-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside: "day-outside text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
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
