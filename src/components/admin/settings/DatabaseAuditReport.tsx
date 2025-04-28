
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditResult, setupAuditFunctions, auditDatabase } from "@/services/audit/databaseAudit";
import { setupExecuteSqlFunction } from "@/services/audit/createCustomFunction";
import { fixCommonDatabaseIssues } from "@/services/audit/setupDatabaseSecurity";
import AuditActionButtons from "./audit/AuditActionButtons";
import AuditStatusAlert from "./audit/AuditStatusAlert";
import FixResultsAlert from "./audit/FixResultsAlert";
import AuditTabs from "./audit/AuditTabs";

const DatabaseAuditReport = () => {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixResults, setFixResults] = useState<{
    success: boolean;
    fixedIssues: string[];
    errors: string[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { toast } = useToast();

  const runAudit = async () => {
    try {
      setIsLoading(true);
      
      const setupSuccess = await setupExecuteSqlFunction();
      if (!setupSuccess) {
        toast({
          title: "Błąd",
          description: "Nie udało się skonfigurować funkcji pomocniczych dla audytu",
          variant: "destructive"
        });
        return;
      }
      
      await setupAuditFunctions();
      const result = await auditDatabase();
      setAuditResult(result);
      
      toast({
        title: "Audyt zakończony",
        description: `Wykryto ${result.recommendations.length} rekomendacji dla bazy danych.`,
      });
    } catch (error) {
      console.error('Błąd podczas audytu:', error);
      toast({
        title: "Błąd audytu",
        description: "Wystąpił błąd podczas analizy bazy danych",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fixDatabaseIssues = async () => {
    try {
      setIsFixing(true);
      setFixResults(null);
      
      const result = await fixCommonDatabaseIssues();
      setFixResults(result);
      
      if (result.success) {
        toast({
          title: "Naprawiono problemy",
          description: `Pomyślnie naprawiono ${result.fixedIssues.length} problemów w bazie danych.`,
        });
        
        await runAudit();
      } else {
        toast({
          title: "Częściowe powodzenie",
          description: `Naprawiono ${result.fixedIssues.length} problemów, ale ${result.errors.length} błędów nie udało się naprawić.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Błąd podczas naprawy:', error);
      toast({
        title: "Błąd naprawy",
        description: "Wystąpił błąd podczas naprawy bazy danych",
        variant: "destructive"
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Audyt bazy danych
          </CardTitle>
          <CardDescription>
            Sprawdź aktualny stan bazy danych i zgodność z dokumentacją techniczną
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <AuditActionButtons
              auditResult={auditResult}
              isLoading={isLoading}
              isFixing={isFixing}
              onRunAudit={runAudit}
              onFixIssues={fixDatabaseIssues}
            />
            
            <div className="flex-1">
              <AuditStatusAlert auditResult={auditResult} />
            </div>
          </div>

          <FixResultsAlert fixResults={fixResults} />

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : auditResult ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Przegląd</TabsTrigger>
                <TabsTrigger value="tables">Tabele</TabsTrigger>
                <TabsTrigger value="relationships">Relacje</TabsTrigger>
                <TabsTrigger value="roles">Role i uprawnienia</TabsTrigger>
                <TabsTrigger value="security">Bezpieczeństwo</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Rekomendacje
                  {auditResult.recommendations.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {auditResult.recommendations.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <AuditTabs auditResult={auditResult} activeTab={activeTab} />
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Kliknij "Rozpocznij audyt" aby przeanalizować strukturę bazy danych</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseAuditReport;
