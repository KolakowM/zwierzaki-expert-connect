
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface PricingFeatureItemProps {
  id: string;
  content: ReactNode;
}

export default function PricingFeatureItem({ content }: PricingFeatureItemProps) {
  return (
    <li className="flex items-center">
      <Check className="mr-2 h-4 w-4 text-primary" />
      <span>{content}</span>
    </li>
  );
}
