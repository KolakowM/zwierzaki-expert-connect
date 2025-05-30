
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { upgradeSubscription, validatePackageUpgrade } from "@/services/subscriptionService";
import { CheckCircle, XCircle, Crown } from "lucide-react";

interface Package {
  id: string;
  name: string;
  price_pln?: number;
  max_clients: number;
  max_pets: number;
  max_services: number;
  max_specializations: number;
  can_access_carousel: boolean;
  can_appear_in_catalog: boolean;
}

interface ActiveSubscription {
  id?: string;
  package_name?: string;
  subscription_id?: string;
  status?: string;
  end_date?: string;
  max_clients?: number;
  max_pets?: number;
  max_services?: number;
  max_specializations?: number;
  can_access_carousel?: boolean;
  can_appear_in_catalog?: boolean;
}

interface PackageUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packages: Package[];
  currentPackage: ActiveSubscription | null;
  onUpgradeSuccess: () => void;
}

const PackageUpgradeDialog = ({
  open,
  onOpenChange,
  packages,
  currentPackage,
  onUpgradeSuccess
}: PackageUpgradeDialogProps) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    canUpgrade: boolean;
    issues: string[];
  } | null>(null);
  const { toast } = useToast();

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setValidationResult(null);
  };

  const handleValidateUpgrade = async () => {
    if (!selectedPackage) return;
    
    setIsValidating(true);
    try {
      const result = await validatePackageUpgrade(
        '', // Will be handled by the service
        currentPackage?.id || '',
        selectedPackage.id
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
    if (!selectedPackage) return;
    
    setIsUpgrading(true);
    try {
      await upgradeSubscription('', selectedPackage.id); // User ID will be handled by the service
      toast({
        title: "Pakiet zaktualizowany",
        description: `Pomyślnie przeszedłeś na pakiet ${selectedPackage.name}`,
      });
      onUpgradeSuccess();
      onOpenChange(false);
      setSelectedPackage(null);
      setValidationResult(null);
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

  const handleClose = () => {
    onOpenChange(false);
    setSelectedPackage(null);
    setValidationResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Wybierz pakiet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Available Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleSelectPackage(pkg)}
              >
                <h4 className="font-semibold">{pkg.name}</h4>
                {pkg.price_pln && (
                  <Badge className="mt-2">
                    {pkg.price_pln} PLN/miesiąc
                  </Badge>
                )}
                <div className="text-sm text-muted-foreground space-y-1 mt-2">
                  <p>Klienci: {pkg.max_clients}</p>
                  <p>Zwierzęta: {pkg.max_pets}</p>
                  <p>Usługi: {pkg.max_services}</p>
                  <p>Specjalizacje: {pkg.max_specializations}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Package Comparison */}
          {selectedPackage && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Obecny pakiet</h4>
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold">{currentPackage?.package_name || 'Trial'}</p>
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
                  <p className="font-semibold">{selectedPackage.name}</p>
                  <div className="text-sm space-y-1">
                    <p>Klienci: {selectedPackage.max_clients}</p>
                    <p>Zwierzęta: {selectedPackage.max_pets}</p>
                    <p>Usługi: {selectedPackage.max_services}</p>
                    <p>Specjalizacje: {selectedPackage.max_specializations}</p>
                  </div>
                  {selectedPackage.price_pln && (
                    <Badge className="mt-2">
                      {selectedPackage.price_pln} PLN/miesiąc
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Validation */}
          {selectedPackage && !validationResult && (
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

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
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
