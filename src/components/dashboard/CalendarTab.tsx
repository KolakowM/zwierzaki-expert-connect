
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

const CalendarTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kalendarz</CardTitle>
        <CardDescription>
          Zarządzaj swoimi wizytami i konsultacjami
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-40 rounded-md border border-dashed">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Kalendarz zostanie zaimplementowany wkrótce</p>
            <p className="text-xs text-muted-foreground mt-1">Funkcja dostępna w przyszłej aktualizacji</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarTab;
