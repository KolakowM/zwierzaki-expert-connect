
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PricingFeatureItem from "./PricingFeatureItem";
import { useTranslation } from "react-i18next";

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
  
  return (
    <Card className={popular ? "border-primary shadow-lg" : ""}>
      {popular && (
        <div className="absolute -top-15 left-0 right-0 mx-auto w-fit border-radius: 25% bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
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
        <Link to="/register" className="w-full">
          <Button
            className="w-full"
            variant={popular ? "default" : "outline"}
          >
            {cta}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
