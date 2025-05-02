
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";

interface FormErrorSummaryProps {
  form: UseFormReturn<any>;
  title?: string;
}

export function FormErrorSummary({ form, title = "Formularz zawiera błędy" }: FormErrorSummaryProps) {
  const errorCount = Object.keys(form.formState.errors).length;
  
  if (errorCount === 0) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4 mt-2">
          {Object.entries(form.formState.errors).map(([field, error]) => (
            <li key={field}>
              <strong>{field}:</strong> {error.message as string}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
