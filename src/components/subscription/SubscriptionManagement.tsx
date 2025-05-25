
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { getActivePackages, cancelSubscription } from "@/services/subscriptionService";
import PackageUpgradeDialog from "./PackageUpgradeDialog";
import { Crown, ArrowRight, AlertTriangle } from "lucide-react";
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

  const getUpgradeablePackages = () => {
    if (isTrialUser) {
      // Dla użytkowników Trial pokaż wszystkie dostępne pakiety
      return availablePackages.filter(pkg => pkg.price_pln && pkg.price_pln > 0);
    }
    
    if (!currentPackage) return [];
    
    return availablePackages.filter(pkg => {
      if (!pkg.price_pln || !currentPackage.price_pln) return false;
      return pkg.price_pln > currentPackage.price_pln;
    });
  };

  const upgradeablePackages = getUpgradeablePackages();

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

      {upgradeablePackages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isTrialUser ? 'Dostępne pakiety' : 'Dostępne upgrade\'y'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {upgradeablePackages.map((pkg) => (
                <div key={pkg.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{pkg.name}</h4>
                      {pkg.description && (
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      )}
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Klienci:</span>
                        <span className="font-medium">{pkg.max_clients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zwierzęta:</span>
                        <span className="font-medium">{pkg.max_pets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Usługi:</span>
                        <span className="font-medium">{pkg.max_services}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Specjalizacje:</span>
                        <span className="font-medium">{pkg.max_specializations}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge>{pkg.price_pln} PLN/miesiąc</Badge>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedUpgradePackage(pkg)}
                        className="flex items-center gap-1"
                      >
                        {isTrialUser ? 'Wybierz' : 'Upgrade'} <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
