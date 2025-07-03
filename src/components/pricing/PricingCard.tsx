
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PricingFeatureItem from "./PricingFeatureItem";
import { useTranslation } from "react-i18next";
import { useStripePayment } from "@/hooks/useStripePayment";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getActivePackages } from "@/services/subscriptionService";

export interface PricingFeature {
  id: string;
  content: ReactNode;
}

export interface PricingTierProps {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  popular: boolean;
  billingPeriod: 'monthly' | 'yearly';
}

export default function PricingCard({
  name,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  cta,
  popular,
  billingPeriod
}: PricingTierProps) {
  const { t } = useTranslation();
  const { createCheckoutSession, isLoading: stripeLoading } = useStripePayment();
  const { user, isAuthenticated } = useAuth();
  
  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: getActivePackages,
  });

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      // Redirect to register if not authenticated
      return;
    }

    if (name === "Testowy") {
      // Free plan, no Stripe checkout needed
      return;
    }

    // Map Polish names to database package names
    const packageNameMap: Record<string, string> = {
      "Zaawansowany": "Advanced",
      "Zawodowiec": "Professional"
    };

    const databasePackageName = packageNameMap[name] || name;
    const selectedPackage = packages?.find(pkg => pkg.name === databasePackageName);

    if (selectedPackage) {
      await createCheckoutSession(selectedPackage.id, billingPeriod);
    }
  };

  const isFreePlan = name === "Testowy";
  
  return (
    <Card className={popular ? "border-primary shadow-lg relative" : ""}>
      {popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit bg-primary px-3 py-1 text-xs font-medium text-primary-foreground rounded-full">
          {t('pricing.recommended')}
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="mt-4">
          <span className="text-3xl font-bold">
            {billingPeriod === 'monthly' ? monthlyPrice : yearlyPrice}
          </span>
          <span className="text-sm text-muted-foreground ml-1">
            {billingPeriod === 'monthly' ? t('pricing.month_suffix') : t('pricing.year_suffix')}
          </span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature) => (
            <PricingFeatureItem key={feature.id} {...feature} />
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {!isAuthenticated ? (
          <Link to="/register" className="w-full">
            <Button
              className="w-full"
              variant={popular ? "default" : "outline"}
            >
              {cta}
            </Button>
          </Link>
        ) : isFreePlan ? (
          <Button
            className="w-full"
            variant="outline"
            disabled
          >
            Current Plan
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={popular ? "default" : "outline"}
            onClick={handleSubscribe}
            disabled={stripeLoading}
          >
            {stripeLoading ? "Loading..." : cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
