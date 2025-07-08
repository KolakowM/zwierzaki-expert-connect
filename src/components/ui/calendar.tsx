
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 sm:p-3 pointer-events-auto w-full", className)}
      classNames={{
        months: "flex flex-col space-y-3 sm:space-y-4",
        month: "space-y-3 sm:space-y-4",
        caption: "flex justify-center items-center py-2 px-2",
        caption_label: "text-base sm:text-lg font-semibold mx-4",
        nav: "flex items-center space-x-2",
        nav_button: "h-8 w-8 sm:h-9 sm:w-9 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground touch-manipulation",
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse space-y-1 mt-2",
        head_row: "grid grid-cols-7 gap-1 mb-2",
        head_cell: "text-muted-foreground rounded-md w-9 h-8 sm:w-10 sm:h-9 font-normal text-xs sm:text-sm flex items-center justify-center",
        row: "grid grid-cols-7 gap-1 mb-1",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:rounded-md",
        day: "h-9 w-9 sm:h-10 sm:w-10 p-0 font-normal hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm sm:text-base transition-colors touch-manipulation",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-semibold",
        day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4 sm:h-5 sm:w-5" {...props} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
