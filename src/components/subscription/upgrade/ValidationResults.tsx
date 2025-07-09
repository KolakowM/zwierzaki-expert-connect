
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, CreditCard } from "lucide-react";
import { Package, ActiveSubscription } from "./types";

interface ValidationResultsProps {
  selectedPackage: Package | null;
  currentPackage: ActiveSubscription | null;
  isUpgrading: boolean;
  stripeLoading: boolean;
  billingPeriod: 'monthly' | 'yearly';
  onStripeCheckout: () => void;
  onUpgrade: () => void;
}

const ValidationResults = ({
  selectedPackage,
  currentPackage,
  isUpgrading,
  stripeLoading,
  billingPeriod,
  onStripeCheckout,
  onUpgrade
}: ValidationResultsProps) => {
  if (!selectedPackage) return null;

  // Check if the selected package is the current package
  const isCurrentPackage = currentPackage?.package_id === selectedPackage.id;

  // Calculate price based on billing period
  const getPrice = () => {
    if (!selectedPackage.price_pln) return 0;
    return billingPeriod === 'yearly' ? selectedPackage.price_pln * 10 : selectedPackage.price_pln;
  };

  const getPriceLabel = () => {
    const price = getPrice();
    const period = billingPeriod === 'yearly' ? 'rok' : 'miesiąc';
    return `${price} PLN/${period}`;
  };

  if (isCurrentPackage) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <p className="font-medium">To jest Twój aktualny pakiet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Masz już ten pakiet aktywny w swojej subskrypcji.
            </p>
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <Alert className="border-green-200 bg-green-50">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <div>
            <p className="font-medium mb-2">Wybierz sposób płatności</p>
            <div className="flex gap-2 mt-3">
              <Button 
                onClick={onStripeCheckout} 
                disabled={stripeLoading}
                className="flex-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {stripeLoading ? "Przekierowywanie..." : `Zapłać ${getPriceLabel()}`}
              </Button>
              <Button 
                onClick={onUpgrade} 
                disabled={isUpgrading}
                variant="outline"
                className="flex-1"
              >
                {isUpgrading ? "Aktualizowanie..." : "Upgrade bez płatności"}
              </Button>
            </div>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default ValidationResults;
