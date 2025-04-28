
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface AuditSecurityTabProps {
  security: {
    rlsPoliciesExist: Record<string, boolean>;
  };
}

const AuditSecurityTab = ({ security }: AuditSecurityTabProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-4 w-4" /> Polityki bezpieczeństwa (RLS)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(security.rlsPoliciesExist).map(([table, exists]) => (
            <div key={table} className="flex justify-between items-center p-2 bg-muted rounded-md">
              <span>Tabela: {table}</span>
              {renderStatus(exists)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditSecurityTab;
