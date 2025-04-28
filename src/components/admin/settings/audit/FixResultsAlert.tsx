
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wrench } from "lucide-react";

interface FixResultsAlertProps {
  fixResults: {
    success: boolean;
    fixedIssues: string[];
    errors: string[];
  } | null;
}

const FixResultsAlert = ({ fixResults }: FixResultsAlertProps) => {
  if (!fixResults) return null;

  return (
    <div className="mb-6">
      <Alert variant={fixResults.errors.length > 0 ? "destructive" : "default"}>
        <Wrench className="h-4 w-4" />
        <AlertTitle>Wynik naprawy</AlertTitle>
        <AlertDescription>
          <div className="mt-2">
            {fixResults.fixedIssues.length > 0 && (
              <div className="mb-2">
                <p className="font-medium text-green-600 dark:text-green-400">Naprawione problemy:</p>
                <ul className="list-disc pl-5 text-sm">
                  {fixResults.fixedIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {fixResults.errors.length > 0 && (
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Błędy:</p>
                <ul className="list-disc pl-5 text-sm">
                  {fixResults.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FixResultsAlert;
