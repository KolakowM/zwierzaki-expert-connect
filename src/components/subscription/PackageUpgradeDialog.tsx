
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useStripeSubscription } from "@/hooks/useStripeSubscription";
import { upgradeSubscription } from "@/services/subscriptionService";
import { Crown } from "lucide-react";
import { Package, ActiveSubscription } from "./upgrade/types";
import BillingPeriodToggle from "./upgrade/BillingPeriodToggle";
import PackageCard from "./upgrade/PackageCard";
import PackageComparison from "./upgrade/PackageComparison";
import ValidationResults from "./upgrade/ValidationResults";
import CurrentSubscriptionStatus from "./upgrade/CurrentSubscriptionStatus";

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
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { toast } = useToast();
  const { createCheckoutSession, openCustomerPortal, isLoading: stripeLoading } = useStripeSubscription();

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
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
          <CurrentSubscriptionStatus
            currentPackage={currentPackage}
            onManageSubscription={handleManageSubscription}
            stripeLoading={stripeLoading}
          />

          {/* Billing Period Toggle */}
          <BillingPeriodToggle
            billingPeriod={billingPeriod}
            onBillingPeriodChange={setBillingPeriod}
          />

          {/* Available Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isSelected={selectedPackage?.id === pkg.id}
                billingPeriod={billingPeriod}
                onClick={() => handleSelectPackage(pkg)}
              />
            ))}
          </div>

          {/* Package Comparison */}
          {selectedPackage && (
            <PackageComparison
              currentPackage={currentPackage}
              selectedPackage={selectedPackage}
            />
          )}

          {/* Payment Options - Show directly when package is selected */}
          <ValidationResults
            selectedPackage={selectedPackage}
            currentPackage={currentPackage}
            isUpgrading={isUpgrading}
            stripeLoading={stripeLoading}
            billingPeriod={billingPeriod}
            onStripeCheckout={handleStripeCheckout}
            onUpgrade={handleUpgrade}
          />

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
