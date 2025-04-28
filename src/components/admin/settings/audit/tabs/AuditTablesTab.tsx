
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Table2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableDetails } from "@/services/audit/databaseAudit";

interface AuditTablesTabProps {
  tables: Record<string, TableDetails>;
}

const AuditTablesTab = ({ tables }: AuditTablesTabProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(tables).map(([name, details]) => (
        <AccordionItem key={name} value={name}>
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center gap-2">
              <Table2 className="h-4 w-4" />
              <span>{name}</span>
              {!details.exists && (
                <Badge variant="destructive" className="ml-2">Brak</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {details.exists ? (
              <div className="space-y-2 pl-4">
                <p className="text-sm text-muted-foreground">{details.description}</p>
                {details.columns && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Kolumny:</h4>
                    <div className="bg-muted p-2 rounded-md">
                      {Object.entries(details.columns).map(([colName, dataType]) => (
                        <div key={colName} className="text-xs py-1 flex justify-between">
                          <span className="font-mono">{colName}</span>
                          <span className="text-muted-foreground">{dataType}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="pl-4">
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Brak tabeli</AlertTitle>
                  <AlertDescription>
                    Ta tabela nie istnieje w bazie danych. Powinna zostać utworzona.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AuditTablesTab;
