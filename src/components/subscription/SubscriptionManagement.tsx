
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PackageUpgradeDialog from "./PackageUpgradeDialog";
import CancelSubscriptionDialog from "./CancelSubscriptionDialog";
import SubscriptionStatusCard from "./SubscriptionStatusCard";
import UsageStatsCard from "./UsageStatsCard";
import PackageFeaturesCard from "./PackageFeaturesCard";
import { useUserSubscription } from "@/hooks/useUserSubscription";

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const { 
    activeSubscription: subscription, 
    isLoadingSubscription: subscriptionLoading,
    usageStats,
    isLoadingUsage: usageLoading,
    refetch
  } = useUserSubscription();

  // Fetch available packages
  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price_pln', { ascending: true });
        
      if (error) throw error;
      return data || [];
    },
  });

  const handleManageSubscription = () => {
    setShowUpgradeDialog(true);
  };

  const handleCancelSubscription = () => {
    setShowCancelDialog(true);
  };

  const handleUpgradeSuccess = () => {
    refetch();
    toast({
      title: "Pakiet zaktualizowany",
      description: "Twój pakiet został pomyślnie zaktualizowany",
    });
  };

  const handleCancelSuccess = () => {
    refetch();
    toast({
      title: "Pakiet anulowany",
      description: "Twój pakiet zostanie anulowany na koniec okresu rozliczeniowego.",
    });
  };

  const isLoading = subscriptionLoading || usageLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-6 w-48 bg-muted/50 rounded mb-2"></div>
            <div className="h-4 w-32 bg-muted/50 rounded mb-4"></div>
            <div className="h-20 bg-muted/50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <SubscriptionStatusCard
        subscription={subscription}
        onManageSubscription={handleManageSubscription}
        onCancelSubscription={handleCancelSubscription}
      />

      {/* Usage Statistics */}
      <UsageStatsCard
        subscription={subscription}
        usageStats={usageStats}
      />

      {/* Package Features */}
      <PackageFeaturesCard
        subscription={subscription}
      />

      {/* Upgrade Dialog */}
      <PackageUpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        packages={packages}
        currentPackage={subscription}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      {/* Cancel Dialog */}
      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        activeSubscription={subscription}
        onCancelSuccess={handleCancelSuccess}
      />
    </div>
  );
};

export default SubscriptionManagement;
