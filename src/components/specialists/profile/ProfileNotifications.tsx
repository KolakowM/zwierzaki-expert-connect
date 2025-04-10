
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ProfileNotificationsProps {
  saveSuccess: boolean;
  saveError: string | null;
}

export function ProfileNotifications({ saveSuccess, saveError }: ProfileNotificationsProps) {
  return (
    <>
      {saveSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Zapisano pomyślnie</AlertTitle>
          <AlertDescription className="text-green-700">
            Twój profil został pomyślnie zaktualizowany.
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert className="mb-4 bg-red-50 border-red-200" variant="destructive">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Błąd zapisu</AlertTitle>
          <AlertDescription className="text-red-700">
            {saveError}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
