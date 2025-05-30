
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { ActiveSubscription } from "@/types/subscription";

interface PackageFeaturesCardProps {
  subscription: ActiveSubscription | null;
}

const PackageFeaturesCard = ({ subscription }: PackageFeaturesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Funkcje pakietu
        </CardTitle>
        <CardDescription>
          Dostępne funkcje w Twoim obecnym pakiecie
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {subscription?.can_access_carousel ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
            <span className="text-sm">Dostęp do karuzeli</span>
          </div>
          
          <div className="flex items-center gap-2">
            {subscription?.can_appear_in_catalog ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            )}
            <span className="text-sm">Widoczność w katalogu</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageFeaturesCard;
