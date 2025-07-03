import { Badge } from "@/components/ui/badge";
import { Package, ActiveSubscription } from "./types";

interface PackageComparisonProps {
  currentPackage: ActiveSubscription | null;
  selectedPackage: Package;
}

const PackageComparison = ({ currentPackage, selectedPackage }: PackageComparisonProps) => {
  return (
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
  );
};

export default PackageComparison;