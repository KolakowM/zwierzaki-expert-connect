
import { AlertCircle } from "lucide-react";

interface ErrorToastDetailsProps {
  message: string;
  error?: string;
  fields?: string[];
}

export function ErrorToastDetails({ message, error, fields = [] }: ErrorToastDetailsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <p>{message}</p>
      </div>
      
      {fields && fields.length > 0 && (
        <div className="pl-7">
          <p className="font-semibold text-sm">Pola z błędami:</p>
          <ul className="list-disc pl-4 text-sm">
            {fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive/80 pl-7">{error}</p>
      )}
    </div>
  );
}
