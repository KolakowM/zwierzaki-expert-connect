
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkDatabaseSetup } from "@/services/setupService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

const DatabaseSetupChecker = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [setupStatus, setSetupStatus] = useState({
    tablesExist: false,
    clientsTableExists: false,
    petsTableExists: false,
    visitsTableExists: false,
    careProgramsTableExists: false,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        setIsLoading(true);
        const status = await checkDatabaseSetup();
        setSetupStatus(status);
      } catch (error) {
        console.error("Error checking database setup:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSetup();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (setupStatus.tablesExist) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Baza danych została prawidłowo skonfigurowana</AlertTitle>
        <AlertDescription>
          Wszystkie wymagane tabele istnieją i aplikacja powinna działać prawidłowo.
        </AlertDescription>
      </Alert>
    );
  }

  const missingTables = [
    !setupStatus.clientsTableExists && 'Klienci',
    !setupStatus.petsTableExists && 'Zwierzęta',
    !setupStatus.visitsTableExists && 'Wizyty',
    !setupStatus.careProgramsTableExists && 'Programy opieki',
  ].filter(Boolean);

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Problem z konfiguracją bazy danych</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>
          Niektóre wymagane tabele nie istnieją w bazie danych. Brakujące tabele:
          {" "}{missingTables.join(", ")}
        </p>
        <Button 
          variant="default"
          onClick={() => {
            toast({
              title: "Konfiguracja bazy danych",
              description: "Skontaktuj się z administratorem, aby poprawnie skonfigurować bazę danych."
            });
          }}
        >
          Utwórz tabele
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DatabaseSetupChecker;
