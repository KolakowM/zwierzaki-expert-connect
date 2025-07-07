
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
    <Card>
      <CardHeader>
        <CardTitle>Kalendarz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelectDate}
          locale={pl}
          weekStartsOn={1}
          className="rounded-md border w-full"
        />
        <Button 
          className="w-full" 
          onClick={onAddAppointment}
        >
          <Plus size={16} className="mr-2" />
          Nowa wizyta
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarSidebar;
