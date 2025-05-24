
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { Button } from "@/components/ui/button";
import { Crown, Users, Heart, Briefcase, Star } from "lucide-react";

const PackageStatusCard = () => {
  const { activeSubscription, usageStats, isLoadingSubscription, isTrialUser, isSubscriptionExpired } = useUserSubscription();

  if (isLoadingSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Status pakietu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    if (isTrialUser) {
      return <Badge variant="secondary">Trial</Badge>;
    }
    if (isSubscriptionExpired) {
      return <Badge variant="destructive">Wygasła</Badge>;
    }
    return <Badge variant="default">Aktywna</Badge>;
  };

  const getLimitProgress = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const limits = activeSubscription || {
    max_clients: 5,
    max_pets: 10,
    max_services: 3,
    max_specializations: 2,
    package_name: 'Trial'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Pakiet: {activeSubscription?.package_name || 'Trial'}
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageStats && (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Klienci
                </div>
                <span>{usageStats.clients_count}/{limits.max_clients}</span>
              </div>
              <Progress value={getLimitProgress(usageStats.clients_count, limits.max_clients)} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Zwierzęta
                </div>
                <span>{usageStats.pets_count}/{limits.max_pets}</span>
              </div>
              <Progress value={getLimitProgress(usageStats.pets_count, limits.max_pets)} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Usługi
                </div>
                <span>{usageStats.services_count}/{limits.max_services}</span>
              </div>
              <Progress value={getLimitProgress(usageStats.services_count, limits.max_services)} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Specjalizacje
                </div>
                <span>{usageStats.specializations_count}/{limits.max_specializations}</span>
              </div>
              <Progress value={getLimitProgress(usageStats.specializations_count, limits.max_specializations)} />
            </div>
          </div>
        )}

        {(isTrialUser || isSubscriptionExpired) && (
          <div className="pt-2">
            <Button className="w-full" variant="default">
              Ulepsz pakiet
            </Button>
          </div>
        )}

        {activeSubscription?.end_date && !isSubscriptionExpired && (
          <div className="text-sm text-muted-foreground">
            Wygasa: {new Date(activeSubscription.end_date).toLocaleDateString('pl-PL')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PackageStatusCard;
