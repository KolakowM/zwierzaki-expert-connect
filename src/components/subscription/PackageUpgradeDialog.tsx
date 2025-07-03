
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useStripeSubscription } from "@/hooks/useStripeSubscription";
import { upgradeSubscription, validatePackageUpgrade } from "@/services/subscriptionService";
import { CheckCircle, XCircle, Crown, CreditCard, Settings, Check } from "lucide-react";

interface Package {
  id: string;
  name: string;
  description?: string;
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
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isValidating, setIsValidating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    canUpgrade: boolean;
    issues: string[];
  } | null>(null);
  const { toast } = useToast();
  const { createCheckoutSession, openCustomerPortal, isLoading: stripeLoading } = useStripeSubscription();

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

  const handleStripeCheckout = async () => {
    if (!selectedPackage) return;
    
    try {
      await createCheckoutSession(selectedPackage.id, billingPeriod);
      onOpenChange(false);
      toast({
        title: "Przekierowanie do płatności",
        description: "Zostałeś przekierowany do Stripe w celu dokonania płatności",
      });
      // Refresh subscription status after some delay
      setTimeout(() => {
        onUpgradeSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Błąd płatności",
        description: "Nie udało się uruchomić procesu płatności",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    await openCustomerPortal();
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
    setBillingPeriod('monthly');
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
          {/* Current Subscription Status */}
          {currentPackage && (
            <div className="p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Active Subscription
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentPackage.package_name}
                </span>
              </div>
              <Button 
                onClick={handleManageSubscription}
                disabled={stripeLoading}
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          )}

          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-lg w-fit mx-auto">
            <Button
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
            </Button>
          </div>

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
                {pkg.description && (
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                )}
                {pkg.price_pln && (
                  <Badge className="mt-2">
                    {pkg.price_pln} PLN/{billingPeriod === 'monthly' ? 'miesiąc' : 'rok'}
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
                    <div>
                      <p className="font-medium mb-2">Możesz przejść na ten pakiet</p>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          onClick={handleStripeCheckout} 
                          disabled={stripeLoading}
                          className="flex-1"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          {stripeLoading ? "Przekierowywanie..." : `Zapłać ${selectedPackage?.price_pln} PLN`}
                        </Button>
                        <Button 
                          onClick={handleUpgrade} 
                          disabled={isUpgrading}
                          variant="outline"
                          className="flex-1"
                        >
                          {isUpgrading ? "Aktualizowanie..." : "Upgrade bez płatności"}
                        </Button>
                      </div>
                    </div>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageUpgradeDialog;
