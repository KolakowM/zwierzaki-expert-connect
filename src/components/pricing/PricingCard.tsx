
import { ReactNode, useState } from "react";
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
  
  const { data: packages, isLoading: packagesLoading } = useQuery({
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

    const packageNameMap: Record<string, string> = {
      "Zaawansowany": "Zaawansowany",
      "Zawodowiec": "Zawodowiec"
    };

    const databasePackageName = packageNameMap[name] || name;
    const selectedPackage = packages?.find(pkg => pkg.name === databasePackageName);

    if (selectedPackage) {
      await createCheckoutSession(
        selectedPackage.id, 
        billingPeriod
      );
    } else {
      console.error('Package not found:', databasePackageName);
    }
  };

  const isFreePlan = name === "Testowy";
  const isLoading = stripeLoading || packagesLoading;

  // Calculate displayed price and savings
  const getDisplayPrice = () => {
    if (billingPeriod === 'monthly') {
      return monthlyPrice;
    } else {
      return yearlyPrice;
    }
  };

  const getSavingsInfo = () => {
    if (billingPeriod === 'yearly' && !isFreePlan) {
      // Extract numeric value from price strings
      const monthlyNum = parseInt(monthlyPrice.replace(/[^0-9]/g, ''));
      const yearlyNum = parseInt(yearlyPrice.replace(/[^0-9]/g, ''));
      
      if (monthlyNum && yearlyNum) {
        const monthlyYearlyEquivalent = monthlyNum * 12;
        const savings = monthlyYearlyEquivalent - yearlyNum;
        return savings > 0 ? `Oszczędzasz ${savings} zł rocznie` : null;
      }
    }
    return null;
  };
  
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
            {getDisplayPrice()}
          </span>
          <span className="text-sm text-muted-foreground ml-1">
            {billingPeriod === 'monthly' ? t('pricing.month_suffix') : t('pricing.year_suffix')}
          </span>
          {getSavingsInfo() && (
            <div className="text-xs text-green-600 font-medium mt-1">
              {getSavingsInfo()}
            </div>
          )}
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
            Plan aktualny
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={popular ? "default" : "outline"}
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? "Ładowanie..." : cta}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
