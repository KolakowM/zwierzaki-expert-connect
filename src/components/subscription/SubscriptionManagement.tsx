
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { getActivePackages, cancelSubscription } from "@/services/subscriptionService";
import PackageUpgradeDialog from "./PackageUpgradeDialog";
import { Crown, ArrowRight, AlertTriangle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { activeSubscription, isLoadingSubscription, refetch, isTrialUser } = useUserSubscription();
  const [selectedUpgradePackage, setSelectedUpgradePackage] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const { data: availablePackages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ['availablePackages'],
    queryFn: getActivePackages,
  });

  const currentPackage = availablePackages.find(pkg => pkg.id === activeSubscription?.package_id);

  const getAvailablePackages = () => {
    if (isTrialUser) {
      // Dla użytkowników Trial pokaż wszystkie płatne pakiety
      return availablePackages.filter(pkg => pkg.price_pln && pkg.price_pln > 0);
    }
    
    if (!currentPackage) return [];
    
    // Dla użytkowników z aktywnym pakietem pokaż tylko droższe opcje
    return availablePackages.filter(pkg => {
      if (!pkg.price_pln || !currentPackage.price_pln) return false;
      return pkg.price_pln > currentPackage.price_pln;
    });
  };

  const availableUpgrades = getAvailablePackages();

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;
    
    setIsCancelling(true);
    try {
      await cancelSubscription(activeSubscription.subscription_id);
      toast({
        title: "Pakiet anulowany",
        description: "Twój pakiet zostanie anulowany na koniec okresu rozliczeniowego.",
      });
      refetch();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się anulować pakietu. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoadingSubscription || isLoadingPackages) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Zarządzanie subskrypcją
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Aktualny pakiet</h4>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{currentPackage?.name || 'Trial'}</p>
                  <div className="text-sm text-muted-foreground">
                    <span>Klienci: {currentPackage?.max_clients || 5}</span>
                    <span className="mx-2">•</span>
                    <span>Zwierzęta: {currentPackage?.max_pets || 10}</span>
                    <span className="mx-2">•</span>
                    <span>Usługi: {currentPackage?.max_services || 3}</span>
                  </div>
                </div>
                <div className="text-right">
                  {currentPackage?.price_pln ? (
                    <Badge>{currentPackage.price_pln} PLN/miesiąc</Badge>
                  ) : (
                    <Badge variant="secondary">Bezpłatny</Badge>
                  )}
                </div>
              </div>
            </div>

            {activeSubscription?.end_date && (
              <div className="text-sm text-muted-foreground">
                Wygasa: {new Date(activeSubscription.end_date).toLocaleDateString('pl-PL')}
              </div>
            )}

            {!isTrialUser && activeSubscription && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Anuluj pakiet
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Czy na pewno chcesz anulować pakiet?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Pakiet zostanie anulowany na koniec okresu rozliczeniowego. 
                      Będziesz mógł korzystać z funkcji do {activeSubscription.end_date ? new Date(activeSubscription.end_date).toLocaleDateString('pl-PL') : 'końca okresu'}.
                      Po tym czasie Twoje konto zostanie przełączone na plan Trial.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anuluj</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                    >
                      {isCancelling ? 'Anulowanie...' : 'Potwierdź anulowanie'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

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
                <div key={pkg.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
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
                        onClick={() => setSelectedUpgradePackage(pkg)}
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        {isTrialUser ? 'Wybierz pakiet' : 'Upgrade'} 
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
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

      {selectedUpgradePackage && (
        <PackageUpgradeDialog
          isOpen={!!selectedUpgradePackage}
          onClose={() => setSelectedUpgradePackage(null)}
          currentPackage={currentPackage || null}
          targetPackage={selectedUpgradePackage}
          userId={user?.id || ''}
          onUpgradeSuccess={() => {
            refetch();
            setSelectedUpgradePackage(null);
          }}
        />
      )}
    </div>
  );
};

export default SubscriptionManagement;
