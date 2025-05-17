
import { ReceiptText } from "lucide-react";
import BillingToggle from "./BillingToggle";
import { useTranslation } from "react-i18next";

interface PricingHeaderProps {
  billingPeriod: 'monthly' | 'yearly';
  setBillingPeriod: (period: 'monthly' | 'yearly') => void;
}

export default function PricingHeader({ billingPeriod, setBillingPeriod }: PricingHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <ReceiptText className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{t('pricing.title')}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {t('pricing.subtitle')}
      </p>
      <BillingToggle billingPeriod={billingPeriod} setBillingPeriod={setBillingPeriod} />
    </div>
  );
}
