
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2 } from "lucide-react";

interface AuditRelationshipsTabProps {
  relationships: Array<{
    table: string;
    column: string;
    referencedTable: string;
    referencedColumn: string;
  }>;
}

const AuditRelationshipsTab = ({ relationships }: AuditRelationshipsTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4" /> Relacje między tabelami
          </CardTitle>
        </CardHeader>
        <CardContent>
          {relationships.length > 0 ? (
            <div className="space-y-2">
              {relationships.map((rel, idx) => (
                <div key={idx} className="p-2 bg-muted rounded-md text-sm">
                  <code>
                    {rel.table}.{rel.column} →{" "}
                    {rel.referencedTable}.{rel.referencedColumn}
                  </code>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Nie znaleziono relacji między tabelami
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditRelationshipsTab;
