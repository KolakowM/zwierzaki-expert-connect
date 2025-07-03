import { Button } from "@/components/ui/button";

interface BillingPeriodToggleProps {
  billingPeriod: 'monthly' | 'yearly';
  onBillingPeriodChange: (period: 'monthly' | 'yearly') => void;
}

const BillingPeriodToggle = ({ billingPeriod, onBillingPeriodChange }: BillingPeriodToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-lg w-fit mx-auto">
      <Button
        variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onBillingPeriodChange('monthly')}
      >
        Monthly
      </Button>
      <Button
        variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onBillingPeriodChange('yearly')}
      >
        Yearly
      </Button>
    </div>
  );
};

export default BillingPeriodToggle;