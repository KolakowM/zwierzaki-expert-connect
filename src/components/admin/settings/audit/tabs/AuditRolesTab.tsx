
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuditRolesTabProps {
  roles: {
    validRoleTypes: string[];
    rolesTriggerExists: boolean;
  };
  specialistProfiles: {
    triggerExists: boolean;
  };
}

const AuditRolesTab = ({ roles, specialistProfiles }: AuditRolesTabProps) => {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Typy ról</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {roles.validRoleTypes.map((role) => (
              <Badge key={role} variant="outline">
                {role}
              </Badge>
            ))}
          </div>
          {!roles.validRoleTypes.includes('specialist') && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Brakująca rola</AlertTitle>
              <AlertDescription>
                Typ enum 'app_role' nie zawiera wymaganej wartości 'specialist'.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Triggery dla ról</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
              <span>Trigger dla nowych użytkowników</span>
              {renderStatus(roles.rolesTriggerExists)}
            </div>
            <div className="flex justify-between items-center p-2 bg-muted rounded-md">
              <span>Trigger dla profili specjalistów</span>
              {renderStatus(specialistProfiles.triggerExists)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditRolesTab;
