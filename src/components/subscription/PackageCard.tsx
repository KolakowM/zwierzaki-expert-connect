
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowRight } from "lucide-react";
import { Package } from "@/types/subscription";

interface PackageCardProps {
  package: Package;
  isTrialUser: boolean;
  onUpgrade: (pkg: Package) => void;
}

const PackageCard = ({ package: pkg, isTrialUser, onUpgrade }: PackageCardProps) => {
  return (
    <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-lg">{pkg.name}</h4>
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
          >
            <Crown className="h-4 w-4 mr-2" />
            {isTrialUser ? 'Wybierz pakiet' : 'Upgrade'} 
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
