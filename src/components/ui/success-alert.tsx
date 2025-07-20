
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface SuccessAlertProps {
  title?: string;
  description: string;
  className?: string;
}

export function SuccessAlert({ title, description, className }: SuccessAlertProps) {
  return (
    <Alert className={cn("border-green-200 bg-green-50 text-green-800", className)}>
      <CheckCircle className="h-4 w-4 text-green-600" />
      {title && <AlertTitle className="text-green-800">{title}</AlertTitle>}
      <AlertDescription className="text-green-700">
        {description}
      </AlertDescription>
    </Alert>
  );
}
