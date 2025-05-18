
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function SubscriptionInfo() {
  const { 
    isSubscribed, 
    subscriptionTier, 
    subscriptionEnd, 
    isLoading, 
    error,
    refreshSubscription,
    openCustomerPortal
  } = useSubscription();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status subskrypcji</CardTitle>
          <CardDescription>Ładowanie informacji o subskrypcji...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status subskrypcji</CardTitle>
          <CardDescription>Wystąpił błąd podczas ładowania informacji o subskrypcji</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={refreshSubscription} variant="outline" size="sm">
            Odśwież
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={isSubscribed ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Status subskrypcji</CardTitle>
            <CardDescription>Aktualne informacje o Twoim pakiecie</CardDescription>
          </div>
          {isSubscribed && (
            <div className="rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs font-medium">
              Aktywna
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isSubscribed ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Plan {subscriptionTier}</h3>
              <p className="text-sm text-muted-foreground">
                Twoja subskrypcja jest aktywna do{' '}
                {subscriptionEnd ? format(subscriptionEnd, 'dd.MM.yyyy') : 'nieokreślonej daty'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Nie masz aktywnej subskrypcji. Wybierz plan, aby korzystać z pełnej funkcjonalności systemu.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {isSubscribed ? (
          <Button onClick={openCustomerPortal} className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Zarządzaj planem
          </Button>
        ) : (
          <Button onClick={() => window.location.href = '/pricing'}>
            Zobacz dostępne pakiety
          </Button>
        )}
        <Button onClick={refreshSubscription} variant="outline" size="icon">
          <Loader2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
