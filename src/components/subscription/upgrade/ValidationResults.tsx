import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, CreditCard } from "lucide-react";
import { ValidationResult, Package } from "./types";

interface ValidationResultsProps {
  validationResult: ValidationResult | null;
  selectedPackage: Package | null;
  isValidating: boolean;
  isUpgrading: boolean;
  stripeLoading: boolean;
  onValidateUpgrade: () => void;
  onStripeCheckout: () => void;
  onUpgrade: () => void;
}

const ValidationResults = ({
  validationResult,
  selectedPackage,
  isValidating,
  isUpgrading,
  stripeLoading,
  onValidateUpgrade,
  onStripeCheckout,
  onUpgrade
}: ValidationResultsProps) => {
  if (!selectedPackage) return null;

  if (!validationResult) {
    return (
      <Button 
        onClick={onValidateUpgrade} 
        disabled={isValidating}
        className="w-full"
      >
        {isValidating ? "Sprawdzanie..." : "Sprawdź kompatybilność"}
      </Button>
    );
  }

  return (
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
                  onClick={onStripeCheckout} 
                  disabled={stripeLoading}
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {stripeLoading ? "Przekierowywanie..." : `Zapłać ${selectedPackage?.price_pln} PLN`}
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
  );
};

export default ValidationResults;