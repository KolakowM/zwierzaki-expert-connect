
import { Badge } from "@/components/ui/badge";
import { Package } from "./types";

interface PackageCardProps {
  package: Package;
  isSelected: boolean;
  billingPeriod: 'monthly' | 'yearly';
  onClick: () => void;
}

const PackageCard = ({ package: pkg, isSelected, billingPeriod, onClick }: PackageCardProps) => {
  // Calculate price based on billing period
  const getPrice = () => {
    if (!pkg.price_pln) return 0;
    return billingPeriod === 'yearly' ? pkg.price_pln * 10 : pkg.price_pln;
  };

  const getPriceLabel = () => {
    const price = getPrice();
    const period = billingPeriod === 'yearly' ? 'rok' : 'miesiąc';
    return `${price} PLN/${period}`;
  };

  const getSavingsLabel = () => {
    if (billingPeriod === 'yearly' && pkg.price_pln) {
      const yearlyPrice = pkg.price_pln * 10;
      const monthlyYearlyEquivalent = pkg.price_pln * 12;
      const savings = monthlyYearlyEquivalent - yearlyPrice;
      return `Oszczędzasz ${savings} PLN rocznie`;
    }
    return null;
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <h4 className="font-semibold">{pkg.name}</h4>
      {pkg.description && (
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
      )}
      <div className="mt-2 space-y-1">
        {pkg.price_pln && (
          <Badge className="block w-fit">
            {getPriceLabel()}
          </Badge>
        )}
        {getSavingsLabel() && (
          <p className="text-xs text-green-600 font-medium">{getSavingsLabel()}</p>
        )}
      </div>
      <div className="text-sm text-muted-foreground space-y-1 mt-3">
        <p>Klienci: {pkg.max_clients}</p>
        <p>Zwierzęta: {pkg.max_pets}</p>
        <p>Usługi: {pkg.max_services}</p>
        <p>Specjalizacje: {pkg.max_specializations}</p>
      </div>
    </div>
  );
};

export default PackageCard;
