import { Badge } from "@/components/ui/badge";
import { Package } from "./types";

interface PackageCardProps {
  package: Package;
  isSelected: boolean;
  billingPeriod: 'monthly' | 'yearly';
  onClick: () => void;
}

const PackageCard = ({ package: pkg, isSelected, billingPeriod, onClick }: PackageCardProps) => {
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
  );
};

export default PackageCard;