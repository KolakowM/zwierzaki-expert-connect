
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { pl } from "date-fns/locale";

interface CalendarSidebarProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onAddAppointment: () => void;
}

const CalendarSidebar = ({ date, onSelectDate, onAddAppointment }: CalendarSidebarProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Kalendarz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelectDate}
            locale={pl}
            weekStartsOn={1}
            className="w-full max-w-md mx-auto"
          />
        </div>
        <Button 
          className="w-full touch-manipulation" 
          onClick={onAddAppointment}
          size="lg"
        >
          <Plus size={18} className="mr-2" />
          Nowa wizyta
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;
