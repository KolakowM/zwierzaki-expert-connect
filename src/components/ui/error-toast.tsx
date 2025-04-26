
import { XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FormError {
  field: string;
  message: string;
  tabName?: string;
}

interface ErrorToastProps {
  errors: FormError[];
  onErrorClick?: (error: FormError) => void;
}

export const ErrorToast = ({ errors, onErrorClick }: ErrorToastProps) => {
  if (errors.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-destructive">
        <XCircle className="h-5 w-5" />
        <span className="font-semibold">Znaleziono błędy w formularzu:</span>
      </div>
      <ul className="list-inside list-disc space-y-1">
        {errors.map((error, index) => (
          <li
            key={index}
            onClick={() => onErrorClick?.(error)}
            className={cn(
              "text-sm",
              onErrorClick && "cursor-pointer hover:underline"
            )}
          >
            {error.tabName && <span className="font-medium">{error.tabName}: </span>}
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
};
