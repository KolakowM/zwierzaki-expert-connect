
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuditResult } from "@/services/audit/databaseAudit";

interface AuditOverviewTabProps {
  auditResult: AuditResult;
}

const AuditOverviewTab = ({ auditResult }: AuditOverviewTabProps) => {
  const renderStatus = (exists: boolean) => {
    return exists ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        OK
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        Brak
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tabele</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(auditResult.tables).map(([name, details]) => (
              <div key={name} className="flex justify-between items-center py-1 border-b last:border-0">
                <span>{name}</span>
                {renderStatus(details.exists)}
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bezpieczeństwo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center py-1 border-b">
              <span>Trigger dla nowych użytkowników</span>
              {renderStatus(auditResult.roles.rolesTriggerExists)}
            </div>
            <div className="flex justify-between items-center py-1 border-b">
              <span>Trigger dla profili specjalistów</span>
              {renderStatus(auditResult.specialistProfiles.triggerExists)}
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Enum app_role zawiera 'specialist'</span>
              {renderStatus(auditResult.roles.validRoleTypes.includes('specialist'))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {auditResult.recommendations.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wykryto problemy</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Audyt wykrył {auditResult.recommendations.length} problemów do naprawy:</p>
            <ul className="list-disc pl-5">
              {auditResult.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
              {auditResult.recommendations.length > 3 && (
                <li>
                  <em>...oraz {auditResult.recommendations.length - 3} więcej (zobacz zakładkę Rekomendacje)</em>
                </li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AuditOverviewTab;
