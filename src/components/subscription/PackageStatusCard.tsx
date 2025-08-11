
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { Button } from "@/components/ui/button";
import { Crown, Users, Heart, Briefcase, Star, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const PackageStatusCard = () => {
  const { activeSubscription, usageStats, isLoadingSubscription, isTrialUser, isSubscriptionExpired } = useUserSubscription();
  const navigate = useNavigate();

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

  const isOverLimit = (current: number, max: number) => {
    return current > max;
  };

  const limits = activeSubscription || {
    max_clients: 5,
    max_pets: 10,
    max_services: 3,
    max_specializations: 1,
    package_name: 'Trial'
  };

  // Check if any limits are exceeded
  const hasOverLimits = usageStats && (
    isOverLimit(usageStats.clients_count, limits.max_clients) ||
    isOverLimit(usageStats.pets_count, limits.max_pets) ||
    isOverLimit(usageStats.services_count, limits.max_services) ||
    isOverLimit(usageStats.specializations_count, limits.max_specializations)
  );

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
        {hasOverLimits && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <p className="font-medium">Przekroczono limity pakietu!</p>
              <p className="text-sm">Niektóre funkcje mogą być ograniczone.</p>
            </AlertDescription>
          </Alert>
        )}

        {usageStats && (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Klienci
                </div>
                <span className={isOverLimit(usageStats.clients_count, limits.max_clients) ? "text-red-600 font-medium" : ""}>
                  {usageStats.clients_count}/{limits.max_clients}
                </span>
              </div>
              <Progress 
                value={getLimitProgress(usageStats.clients_count, limits.max_clients)} 
                className={isOverLimit(usageStats.clients_count, limits.max_clients) ? "bg-red-100" : ""}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Zwierzęta
                </div>
                <span className={isOverLimit(usageStats.pets_count, limits.max_pets) ? "text-red-600 font-medium" : ""}>
                  {usageStats.pets_count}/{limits.max_pets}
                </span>
              </div>
              <Progress 
                value={getLimitProgress(usageStats.pets_count, limits.max_pets)} 
                className={isOverLimit(usageStats.pets_count, limits.max_pets) ? "bg-red-100" : ""}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Usługi
                </div>
                <span className={isOverLimit(usageStats.services_count, limits.max_services) ? "text-red-600 font-medium" : ""}>
                  {usageStats.services_count}/{limits.max_services}
                </span>
              </div>
              <Progress 
                value={getLimitProgress(usageStats.services_count, limits.max_services)} 
                className={isOverLimit(usageStats.services_count, limits.max_services) ? "bg-red-100" : ""}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Specjalizacje
                </div>
                <span className={isOverLimit(usageStats.specializations_count, limits.max_specializations) ? "text-red-600 font-medium" : ""}>
                  {usageStats.specializations_count}/{limits.max_specializations}
                </span>
              </div>
              <Progress 
                value={getLimitProgress(usageStats.specializations_count, limits.max_specializations)} 
                className={isOverLimit(usageStats.specializations_count, limits.max_specializations) ? "bg-red-100" : ""}
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button 
            className="w-full" 
            variant={hasOverLimits ? "destructive" : "default"}
            onClick={() => navigate('/dashboard?tab=subscription')}
          >
            {hasOverLimits ? 'Napraw limity' : (isTrialUser || isSubscriptionExpired) ? 'Ulepsz pakiet' : 'Zarządzaj pakietem'}
          </Button>
        </div>

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
