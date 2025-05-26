
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Star } from "lucide-react";
import { Package } from "@/types/subscription";
import PackageCard from "./PackageCard";

interface AvailablePackagesCardProps {
  availableUpgrades: Package[];
  isTrialUser: boolean;
  onUpgrade: (pkg: Package) => void;
}

const AvailablePackagesCard = ({ availableUpgrades, isTrialUser, onUpgrade }: AvailablePackagesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          {isTrialUser ? 'Wybierz swój pakiet' : 'Dostępne upgrade\'y'}
        </CardTitle>
        {isTrialUser && (
          <p className="text-sm text-muted-foreground">
            Aktualnie korzystasz z darmowego planu Trial. Wybierz pakiet dopasowany do Twoich potrzeb.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {availableUpgrades.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableUpgrades.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isTrialUser={isTrialUser}
                onUpgrade={onUpgrade}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {isTrialUser ? 'Brak dostępnych pakietów' : 'Masz już najlepszy pakiet!'}
            </h3>
            <p className="text-muted-foreground">
              {isTrialUser 
                ? 'Obecnie nie ma dostępnych pakietów płatnych.' 
                : 'Korzystasz już z najwyższego dostępnego pakietu.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailablePackagesCard;
