
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PricingFeatureItem from "./PricingFeatureItem";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Skip checkout for free tier
  const isFreeTier = name === "Testowy";

  const handleCheckout = async () => {
    if (isFreeTier) return;
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      toast({
        title: "Wymagane logowanie",
        description: "Musisz się zalogować, aby wykupić subskrypcję",
        variant: "default",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planName: name,
          billingPeriod
        }
      });

      if (error) {
        throw error;
      }

      if (data && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Błąd płatności",
        description: "Nie udało się utworzyć sesji płatności",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={popular ? "border-primary shadow-lg" : ""}>
      {popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
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
        {isFreeTier ? (
          <Link to="/register" className="w-full">
            <Button
              className="w-full"
              variant={popular ? "default" : "outline"}
            >
              {cta}
            </Button>
          </Link>
        ) : (
          <Button
            className="w-full"
            variant={popular ? "default" : "outline"}
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ładowanie...
              </>
            ) : (
              cta
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
