
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface BillingToggleProps {
  billingPeriod: 'monthly' | 'yearly';
  setBillingPeriod: (period: 'monthly' | 'yearly') => void;
}

export default function BillingToggle({ billingPeriod, setBillingPeriod }: BillingToggleProps) {
  const { t } = useTranslation();
  
  return (
    <div className="mt-6 inline-flex items-center rounded-lg border p-1">
      <Button
        variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
        onClick={() => setBillingPeriod('monthly')}
        className="relative z-10"
      >
        {t('pricing.monthly')}
      </Button>
      <Button
        variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
        onClick={() => setBillingPeriod('yearly')}
        className="relative z-10"
      >
        {t('pricing.yearly_with_discount')}
      </Button>
    </div>
  );
}
