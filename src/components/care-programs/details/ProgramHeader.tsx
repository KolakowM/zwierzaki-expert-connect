
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarRange } from "lucide-react";
import { CareProgram } from "@/types";

interface ProgramHeaderProps {
  program: CareProgram;
  formatDate: (dateString?: string | Date) => string;
}

const ProgramHeader = ({ program, formatDate }: ProgramHeaderProps) => {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div>
        <h2 className="text-2xl font-bold">{program.name}</h2>
        <div className="flex items-center mt-1 text-muted-foreground">
          <CalendarRange className="h-4 w-4 mr-1.5" />
          <span className="text-sm">
            {formatDate(program.startDate)}
            {program.endDate && ` - ${formatDate(program.endDate)}`}
          </span>
        </div>
      </div>
      <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
        program.status === "aktywny"
          ? "bg-green-100 text-green-800"
          : program.status === "zakończony"
          ? "bg-blue-100 text-blue-800"
          : "bg-red-100 text-red-800"
      }`}>
        {program.status}
      </div>
    </div>
  );
};

export default ProgramHeader;
