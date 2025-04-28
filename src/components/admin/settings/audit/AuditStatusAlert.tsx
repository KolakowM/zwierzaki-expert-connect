
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AuditResult } from "@/services/audit/databaseAudit";

interface AuditStatusAlertProps {
  auditResult: AuditResult | null;
}

const AuditStatusAlert = ({ auditResult }: AuditStatusAlertProps) => {
  if (!auditResult) return null;

  return (
    <Alert variant={auditResult.recommendations.length > 0 ? "destructive" : "default"} className="h-full">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Wynik audytu</AlertTitle>
      <AlertDescription>
        {auditResult.recommendations.length === 0 
          ? "Wszystkie struktury bazy danych są zgodne z dokumentacją."
          : `Znaleziono ${auditResult.recommendations.length} rekomendacji do poprawy.`}
      </AlertDescription>
    </Alert>
  );
};

export default AuditStatusAlert;
