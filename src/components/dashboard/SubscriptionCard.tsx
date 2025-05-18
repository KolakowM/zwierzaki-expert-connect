
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, PieChart } from "lucide-react";
import { format } from "date-fns";

export default function SubscriptionCard() {
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
          <CardTitle>Plan</CardTitle>
          <CardDescription>Ładowanie informacji...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const planValue = subscriptionTier || "Podstawowy";
  
  return (
    <Card className={isSubscribed ? "border-primary" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Plan</CardTitle>
          <CardDescription>Aktualny plan subskrypcji</CardDescription>
        </div>
        <div className="h-4 w-4 text-muted-foreground">
          <PieChart className="h-4 w-4" />
        </div>
        {isSubscribed && (
          <div className="rounded-full bg-green-100 text-green-800 px-2 py-1 text-xs font-medium">
            Aktywna
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{planValue}</div>
        {isSubscribed ? (
          <p className="text-xs text-muted-foreground">
            Aktywna do{' '}
            {subscriptionEnd ? format(subscriptionEnd, 'dd.MM.yyyy') : 'nieokreślonej daty'}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Wybierz plan, aby korzystać z pełnej funkcjonalności</p>
        )}
      </CardContent>
      <CardFooter className="pt-1">
        {isSubscribed ? (
          <Button onClick={openCustomerPortal} variant="outline" size="sm" className="w-full flex items-center justify-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Zarządzaj planem
          </Button>
        ) : (
          <Button onClick={() => window.location.href = '/pricing'} variant="outline" size="sm" className="w-full">
            Zobacz dostępne pakiety
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
