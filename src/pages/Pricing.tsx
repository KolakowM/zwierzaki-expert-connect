
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingCard from "@/components/pricing/PricingCard";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import { usePricingTiers } from "@/components/pricing/pricingData";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Pricing() {
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const pricingTiers = usePricingTiers();

  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <div className="container py-12 md:py-20">
          <div className="mx-auto max-w-5xl space-y-6">
            <PricingHeader 
              billingPeriod={billingPeriod} 
              setBillingPeriod={setBillingPeriod} 
            />

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <PricingCard 
                  key={tier.name}
                  {...tier}
                  billingPeriod={billingPeriod}
                />
              ))}
            </div>

            <PricingFAQ />
          </div>
        </div>
      </MainLayout>
    </QueryClientProvider>
  );
}
