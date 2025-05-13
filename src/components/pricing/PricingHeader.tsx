
import { ReceiptText } from "lucide-react";
import BillingToggle from "./BillingToggle";

interface PricingHeaderProps {
  billingPeriod: 'monthly' | 'yearly';
  setBillingPeriod: (period: 'monthly' | 'yearly') => void;
}

export default function PricingHeader({ billingPeriod, setBillingPeriod }: PricingHeaderProps) {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <ReceiptText className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Przejrzyste ceny</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Wybierz plan odpowiedni dla Twojej praktyki
      </p>
      <BillingToggle billingPeriod={billingPeriod} setBillingPeriod={setBillingPeriod} />
    </div>
  );
}
