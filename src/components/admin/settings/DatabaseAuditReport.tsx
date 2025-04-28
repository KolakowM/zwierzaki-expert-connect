import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TableDetails, AuditResult, setupAuditFunctions, auditDatabase } from "@/services/audit/databaseAudit";
import { setupExecuteSqlFunction } from "@/services/audit/createCustomFunction";
import { fixCommonDatabaseIssues } from "@/services/audit/setupDatabaseSecurity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Database, Shield, Link2, Table2, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
      
      // Najpierw ustaw funkcję pomocniczą do wykonywania SQL
      const setupSuccess = await setupExecuteSqlFunction();
      if (!setupSuccess) {
        toast({
          title: "Błąd",
          description: "Nie udało się skonfigurować funkcji pomocniczych dla audytu",
          variant: "destructive"
        });
        return;
      }
      
      // Ustaw funkcje audytowe
      await setupAuditFunctions();
      
      // Wykonaj audyt
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
      
      // Wykonaj naprawę problemów
      const result = await fixCommonDatabaseIssues();
      setFixResults(result);
      
      // Pokaż odpowiedni komunikat
      if (result.success) {
        toast({
          title: "Naprawiono problemy",
          description: `Pomyślnie naprawiono ${result.fixedIssues.length} problemów w bazie danych.`,
        });
        
        // Odśwież dane audytu po naprawie
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

  const renderStatus = (exists: boolean) => {
    return exists ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" /> OK
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <XCircle className="h-3 w-3 mr-1" /> Brak
      </Badge>
    );
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
            <Button 
              onClick={runAudit}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Analizowanie..." : "Rozpocznij audyt"}
            </Button>
            
            {auditResult && auditResult.recommendations.length > 0 && (
              <Button 
                onClick={fixDatabaseIssues}
                disabled={isFixing || isLoading}
                variant="outline"
                className="min-w-[120px]"
              >
                {isFixing ? "Naprawianie..." : "Napraw problemy"}
              </Button>
            )}
            
            <div className="flex-1">
              {auditResult && (
                <Alert variant={auditResult.recommendations.length > 0 ? "destructive" : "default"} className="h-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Wynik audytu</AlertTitle>
                  <AlertDescription>
                    {auditResult.recommendations.length === 0 
                      ? "Wszystkie struktury bazy danych są zgodne z dokumentacją."
                      : `Znaleziono ${auditResult.recommendations.length} rekomendacji do poprawy.`}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {fixResults && (
            <div className="mb-6">
              <Alert variant={fixResults.errors.length > 0 ? "destructive" : "default"}>
                <Wrench className="h-4 w-4" />
                <AlertTitle>Wynik naprawy</AlertTitle>
                <AlertDescription>
                  <div className="mt-2">
                    {fixResults.fixedIssues.length > 0 && (
                      <div className="mb-2">
                        <p className="font-medium text-green-600 dark:text-green-400">Naprawione problemy:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {fixResults.fixedIssues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {fixResults.errors.length > 0 && (
                      <div>
                        <p className="font-medium text-red-600 dark:text-red-400">Błędy:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {fixResults.errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

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
              
              <TabsContent value="overview" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="tables">
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(auditResult.tables).map(([name, details]) => (
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
              </TabsContent>
              
              <TabsContent value="relationships">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Link2 className="h-4 w-4" /> Relacje między tabelami
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {auditResult.relationships.length > 0 ? (
                        <div className="space-y-2">
                          {auditResult.relationships.map((rel, idx) => (
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
              </TabsContent>
              
              <TabsContent value="roles">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Typy ról</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        {auditResult.roles.validRoleTypes.map((role) => (
                          <Badge key={role} variant="outline">
                            {role}
                          </Badge>
                        ))}
                      </div>
                      {!auditResult.roles.validRoleTypes.includes('specialist') && (
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
                          {renderStatus(auditResult.roles.rolesTriggerExists)}
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                          <span>Trigger dla profili specjalistów</span>
                          {renderStatus(auditResult.specialistProfiles.triggerExists)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Polityki bezpieczeństwa (RLS)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(auditResult.security.rlsPoliciesExist).map(([table, exists]) => (
                        <div key={table} className="flex justify-between items-center p-2 bg-muted rounded-md">
                          <span>Tabela: {table}</span>
                          {renderStatus(exists)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rekomendacje</CardTitle>
                    <CardDescription>
                      Lista rekomendowanych zmian w strukturze bazy danych
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {auditResult.recommendations.length > 0 ? (
                      <div className="space-y-2">
                        {auditResult.recommendations.map((rec, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {rec}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Wszystko w porządku</AlertTitle>
                        <AlertDescription>
                          Nie znaleziono rekomendacji do poprawy. Struktura bazy danych jest zgodna z dokumentacją.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
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
