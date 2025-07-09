
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
        Miesięcznie
      </Button>
      <Button
        variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onBillingPeriodChange('yearly')}
      >
        Rocznie
        <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
          -17%
        </span>
      </Button>
    </div>
  );
};

export default BillingPeriodToggle;
