
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuditRecommendationsTabProps {
  recommendations: string[];
}

const AuditRecommendationsTab = ({ recommendations }: AuditRecommendationsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rekomendacje</CardTitle>
        <CardDescription>
          Lista rekomendowanych zmian w strukturze bazy danych
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
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
  );
};

export default AuditRecommendationsTab;
