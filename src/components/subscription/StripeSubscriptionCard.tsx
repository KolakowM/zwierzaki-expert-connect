
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStripeSubscription } from "@/hooks/useStripeSubscription";
import { Package } from "@/types/subscription";
import { Check, CreditCard, Settings } from "lucide-react";

interface StripeSubscriptionCardProps {
  packages: Package[];
  currentPackage?: any;
  onSubscriptionChange?: () => void;
}

const StripeSubscriptionCard = ({ packages, currentPackage, onSubscriptionChange }: StripeSubscriptionCardProps) => {
  const { createCheckoutSession, openCustomerPortal, isLoading } = useStripeSubscription();

  const handleSubscribe = async (packageId: string, billingPeriod: 'monthly' | 'yearly') => {
    await createCheckoutSession(packageId, billingPeriod);
    // Optionally refresh subscription status after some delay
    setTimeout(() => {
      onSubscriptionChange?.();
    }, 2000);
  };

  const handleManageSubscription = async () => {
    await openCustomerPortal();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Stripe Subscription Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentPackage && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Check className="h-3 w-3 mr-1" />
                Active Subscription
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentPackage.package_name}
              </span>
            </div>
            
            <Button 
              onClick={handleManageSubscription}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-medium">Available Packages</h3>
          <div className="grid gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{pkg.name}</h4>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{pkg.price_pln ? `${pkg.price_pln} PLN` : 'Free'}</div>
                    <div className="text-xs text-muted-foreground">
                      {pkg.interval_unit === 'month' ? 'per month' : pkg.interval_unit === 'year' ? 'per year' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  • {pkg.max_clients} clients
                  • {pkg.max_pets} pets
                  • {pkg.max_services} services
                  • {pkg.max_specializations} specializations
                </div>

                {pkg.price_pln && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSubscribe(pkg.id, 'monthly')}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Subscribe Monthly
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSubscribe(pkg.id, 'yearly')}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Subscribe Yearly
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeSubscriptionCard;
