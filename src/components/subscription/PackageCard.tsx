
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowRight, Check } from "lucide-react";
import { Package } from "@/types/subscription";

interface PackageCardProps {
  package: Package;
  currentPackage: Package | null;
  isTrialUser: boolean;
  onUpgrade: (pkg: Package) => void;
}

const PackageCard = ({ package: pkg, currentPackage, isTrialUser, onUpgrade }: PackageCardProps) => {
  const isCurrentPackage = currentPackage?.id === pkg.id;
  const isDowngrade = currentPackage && pkg.price_pln && currentPackage.price_pln && pkg.price_pln < currentPackage.price_pln;
  const isUpgrade = currentPackage && pkg.price_pln && currentPackage.price_pln && pkg.price_pln > currentPackage.price_pln;

  const getButtonText = () => {
    if (isCurrentPackage) return 'Aktualny pakiet';
    if (isTrialUser) return 'Wybierz pakiet';
    if (isDowngrade) return 'Zmień na niższy';
    if (isUpgrade) return 'Upgrade';
    return 'Wybierz pakiet';
  };

  const getButtonVariant = () => {
    if (isCurrentPackage) return 'outline';
    if (isDowngrade) return 'secondary';
    return 'default';
  };

  return (
    <div className={`p-4 border rounded-lg transition-colors ${
      isCurrentPackage 
        ? 'border-primary bg-primary/5' 
        : 'hover:border-primary/50'
    }`}>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-lg">{pkg.name}</h4>
            {isCurrentPackage && (
              <Badge variant="default" className="ml-2">
                <Check className="h-3 w-3 mr-1" />
                Aktualny
              </Badge>
            )}
          </div>
          {pkg.description && (
            <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
          )}
        </div>
        
        <div className="text-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Klienci:</span>
            <span className="font-medium">{pkg.max_clients}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Zwierzęta:</span>
            <span className="font-medium">{pkg.max_pets}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Usługi:</span>
            <span className="font-medium">{pkg.max_services}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Specjalizacje:</span>
            <span className="font-medium">{pkg.max_specializations}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-lg font-semibold">
              {pkg.price_pln} PLN/miesiąc
            </Badge>
          </div>
          <Button 
            className="w-full" 
            variant={getButtonVariant()}
            onClick={() => onUpgrade(pkg)}
            disabled={isCurrentPackage}
          >
            {!isCurrentPackage && <Crown className="h-4 w-4 mr-2" />}
            {getButtonText()}
            {!isCurrentPackage && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
