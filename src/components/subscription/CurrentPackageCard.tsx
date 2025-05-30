
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { Package, ActiveSubscription } from "@/types/subscription";
import CancelSubscriptionDialog from "./CancelSubscriptionDialog";

interface CurrentPackageCardProps {
  currentPackage: Package | null;
  activeSubscription: ActiveSubscription | null;
  isTrialUser: boolean;
  onCancelSuccess: () => void;
}

const CurrentPackageCard = ({ 
  currentPackage, 
  activeSubscription, 
  isTrialUser,
  onCancelSuccess 
}: CurrentPackageCardProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Zarządzanie subskrypcją
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Aktualny pakiet</h4>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-semibold">{currentPackage?.name || 'Trial'}</p>
                <div className="text-sm text-muted-foreground">
                  <span>Klienci: {currentPackage?.max_clients || 5}</span>
                  <span className="mx-2">•</span>
                  <span>Zwierzęta: {currentPackage?.max_pets || 10}</span>
                  <span className="mx-2">•</span>
                  <span>Usługi: {currentPackage?.max_services || 3}</span>
                </div>
              </div>
              <div className="text-right">
                {currentPackage?.price_pln ? (
                  <Badge>{currentPackage.price_pln} PLN/miesiąc</Badge>
                ) : (
                  <Badge variant="secondary">Bezpłatny</Badge>
                )}
              </div>
            </div>
          </div>

          {activeSubscription?.end_date && (
            <div className="text-sm text-muted-foreground">
              Wygasa: {new Date(activeSubscription.end_date).toLocaleDateString('pl-PL')}
            </div>
          )}

          {!isTrialUser && activeSubscription && (
            <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
              Anuluj subskrypcję
            </Button>
          )}

          <CancelSubscriptionDialog 
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            activeSubscription={activeSubscription}
            onCancelSuccess={onCancelSuccess}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPackageCard;
