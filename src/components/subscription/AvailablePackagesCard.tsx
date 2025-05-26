
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Star } from "lucide-react";
import { Package } from "@/types/subscription";
import PackageCard from "./PackageCard";

interface AvailablePackagesCardProps {
  availablePackages: Package[];
  currentPackage: Package | null;
  isTrialUser: boolean;
  onUpgrade: (pkg: Package) => void;
}

const AvailablePackagesCard = ({ availablePackages, currentPackage, isTrialUser, onUpgrade }: AvailablePackagesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          {isTrialUser ? 'Wybierz swój pakiet' : 'Dostępne pakiety'}
        </CardTitle>
        {isTrialUser ? (
          <p className="text-sm text-muted-foreground">
            Aktualnie korzystasz z darmowego planu Trial. Wybierz pakiet dopasowany do Twoich potrzeb.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Możesz zmienić swój pakiet na wyższy lub niższy w każdej chwili.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {availablePackages.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availablePackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                currentPackage={currentPackage}
                isTrialUser={isTrialUser}
                onUpgrade={onUpgrade}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Brak dostępnych pakietów
            </h3>
            <p className="text-muted-foreground">
              Obecnie nie ma dostępnych pakietów płatnych.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailablePackagesCard;
