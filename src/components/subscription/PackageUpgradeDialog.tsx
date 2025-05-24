
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Package } from "@/types/subscription";
import { upgradeSubscription, validatePackageUpgrade } from "@/services/subscriptionService";
import { CheckCircle, XCircle, Crown } from "lucide-react";

interface PackageUpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPackage: Package | null;
  targetPackage: Package;
  userId: string;
  onUpgradeSuccess: () => void;
}

const PackageUpgradeDialog = ({
  isOpen,
  onClose,
  currentPackage,
  targetPackage,
  userId,
  onUpgradeSuccess
}: PackageUpgradeDialogProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    canUpgrade: boolean;
    issues: string[];
  } | null>(null);
  const { toast } = useToast();

  const handleValidateUpgrade = async () => {
    setIsValidating(true);
    try {
      const result = await validatePackageUpgrade(
        userId,
        currentPackage?.id || '',
        targetPackage.id
      );
      setValidationResult(result);
    } catch (error) {
      console.error('Error validating upgrade:', error);
      toast({
        title: "Błąd walidacji",
        description: "Nie udało się sprawdzić możliwości upgrade'u",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await upgradeSubscription(userId, targetPackage.id);
      toast({
        title: "Pakiet zaktualizowany",
        description: `Pomyślnie przeszedłeś na pakiet ${targetPackage.name}`,
      });
      onUpgradeSuccess();
      onClose();
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast({
        title: "Błąd upgrade'u",
        description: "Nie udało się zaktualizować pakietu",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Upgrade do pakietu {targetPackage.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Porównanie pakietów */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Obecny pakiet</h4>
              <div className="p-4 border rounded-lg">
                <p className="font-semibold">{currentPackage?.name || 'Trial'}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Klienci: {currentPackage?.max_clients || 5}</p>
                  <p>Zwierzęta: {currentPackage?.max_pets || 10}</p>
                  <p>Usługi: {currentPackage?.max_services || 3}</p>
                  <p>Specjalizacje: {currentPackage?.max_specializations || 2}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Nowy pakiet</h4>
              <div className="p-4 border rounded-lg bg-primary/5">
                <p className="font-semibold">{targetPackage.name}</p>
                <div className="text-sm space-y-1">
                  <p>Klienci: {targetPackage.max_clients}</p>
                  <p>Zwierzęta: {targetPackage.max_pets}</p>
                  <p>Usługi: {targetPackage.max_services}</p>
                  <p>Specjalizacje: {targetPackage.max_specializations}</p>
                </div>
                {targetPackage.price_pln && (
                  <Badge className="mt-2">
                    {targetPackage.price_pln} PLN/miesiąc
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Walidacja */}
          {!validationResult && (
            <Button 
              onClick={handleValidateUpgrade} 
              disabled={isValidating}
              className="w-full"
            >
              {isValidating ? "Sprawdzanie..." : "Sprawdź kompatybilność"}
            </Button>
          )}

          {validationResult && (
            <Alert className={validationResult.canUpgrade ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {validationResult.canUpgrade ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  {validationResult.canUpgrade ? (
                    "Możesz bezpiecznie przejść na ten pakiet"
                  ) : (
                    <div>
                      <p className="font-medium mb-2">Nie można przejść na ten pakiet:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.issues.map((issue, index) => (
                          <li key={index} className="text-sm">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Akcje */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Anuluj
            </Button>
            {validationResult?.canUpgrade && (
              <Button 
                onClick={handleUpgrade} 
                disabled={isUpgrading}
              >
                {isUpgrading ? "Aktualizowanie..." : "Potwierdź upgrade"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageUpgradeDialog;
