import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Settings } from "lucide-react";
import { ActiveSubscription } from "./types";

interface CurrentSubscriptionStatusProps {
  currentPackage: ActiveSubscription | null;
  onManageSubscription: () => void;
  stripeLoading: boolean;
}

const CurrentSubscriptionStatus = ({ 
  currentPackage, 
  onManageSubscription, 
  stripeLoading 
}: CurrentSubscriptionStatusProps) => {
  if (!currentPackage) return null;

  return (
    <div className="p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Check className="h-3 w-3 mr-1" />
          Active Subscription
        </Badge>
        <span className="text-sm text-muted-foreground">
          {currentPackage.package_name}
        </span>
      </div>
      <Button 
        onClick={onManageSubscription}
        disabled={stripeLoading}
        variant="outline"
        size="sm"
      >
        <Settings className="h-4 w-4 mr-2" />
        Manage Subscription
      </Button>
    </div>
  );
};

export default CurrentSubscriptionStatus;