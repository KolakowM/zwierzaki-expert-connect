
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowRight, Check } from "lucide-react";
import { Package } from "@/types/subscription";

interface PackageCardProps {
  package: Package;
  isTrialUser: boolean;
  onUpgrade: (pkg: Package) => void;
  isCurrentPackage?: boolean;
}

const PackageCard = ({ 
  package: pkg, 
  isTrialUser, 
  onUpgrade,
  isCurrentPackage = false 
}: PackageCardProps) => {
  const getButtonText = () => {
    if (isCurrentPackage) return 'Aktualny pakiet';
    if (isTrialUser) return 'Wybierz pakiet';
    return 'Przejdź na ten pakiet';
  };

  return (
    <div className={`p-4 border rounded-lg transition-colors relative ${
      isCurrentPackage 
        ? 'border-primary bg-primary/5' 
        : 'hover:border-primary/50'
    }`}>
      {isCurrentPackage && (
        <div className="absolute -top-3 left-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
          Aktualny pakiet
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2">
            {pkg.name}
            {isCurrentPackage && <Check className="h-4 w-4 text-primary" />}
          </h4>
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
            onClick={() => onUpgrade(pkg)}
            disabled={isCurrentPackage}
            variant={isCurrentPackage ? "outline" : "default"}
          >
            {isCurrentPackage ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                {getButtonText()}
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                {getButtonText()}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
