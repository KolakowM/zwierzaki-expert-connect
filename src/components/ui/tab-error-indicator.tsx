
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabErrorIndicatorProps {
  count: number;
  className?: string;
}

export const TabErrorIndicator = ({ count, className }: TabErrorIndicatorProps) => {
  if (count === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 text-xs text-white",
        className
      )}
    >
      <XCircle className="mr-1 h-3 w-3" />
      {count}
    </div>
  );
};
