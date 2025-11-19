
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BlackFridayPricingCard from "@/components/pricing/BlackFridayPricingCard";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingCard from "@/components/pricing/PricingCard";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import { usePricingTiers } from "@/components/pricing/pricingData";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Pricing() {
  const { t } = useTranslation();
  const billingPeriod = 'monthly'; // Locked to monthly only
  const pricingTiers = usePricingTiers();

  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <div className="container py-12 md:py-20">
          <div className="mx-auto max-w-6xl space-y-12">
            <PricingHeader 
              billingPeriod={billingPeriod} 
              setBillingPeriod={() => {}} 
            />

            {/* Black Friday Special Card */}
            <div className="mb-8">
              <BlackFridayPricingCard />
            </div>

            {/* Standard pricing tiers */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Standardowe pakiety</h2>
                <p className="text-muted-foreground">
                  Lub wybierz jeden z naszych regularnych planów
                </p>
              </div>
              <div className="mt-8 grid gap-8 md:grid-cols-3">
                {pricingTiers.map((tier) => (
                  <PricingCard 
                    key={tier.name}
                    {...tier}
                    billingPeriod={billingPeriod}
                  />
                ))}
              </div>
            </div>

            <PricingFAQ />
          </div>
        </div>
      </MainLayout>
    </QueryClientProvider>
  );
}
