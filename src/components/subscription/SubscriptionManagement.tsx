
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { getActivePackages } from "@/services/subscriptionService";
import PackageUpgradeDialog from "./PackageUpgradeDialog";
import CurrentPackageCard from "./CurrentPackageCard";
import AvailablePackagesCard from "./AvailablePackagesCard";

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const { activeSubscription, isLoadingSubscription, refetch, isTrialUser } = useUserSubscription();
  const [selectedUpgradePackage, setSelectedUpgradePackage] = useState<any>(null);

  const { data: availablePackages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ['availablePackages'],
    queryFn: getActivePackages,
  });

  const currentPackage = availablePackages.find(pkg => pkg.id === activeSubscription?.package_id);

  const handleUpgradePackage = (pkg: any) => {
    setSelectedUpgradePackage(pkg);
  };

  const handleUpgradeSuccess = () => {
    refetch();
    setSelectedUpgradePackage(null);
  };

  if (isLoadingSubscription || isLoadingPackages) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  }

  return (
    <div className="space-y-6">
      <CurrentPackageCard
        currentPackage={currentPackage || null}
        activeSubscription={activeSubscription}
        isTrialUser={isTrialUser}
        onCancelSuccess={refetch}
      />

      <AvailablePackagesCard
        availablePackages={availablePackages}
        currentPackage={currentPackage || null}
        isTrialUser={isTrialUser}
        onUpgrade={handleUpgradePackage}
      />

      {selectedUpgradePackage && (
        <PackageUpgradeDialog
          isOpen={!!selectedUpgradePackage}
          onClose={() => setSelectedUpgradePackage(null)}
          currentPackage={currentPackage || null}
          targetPackage={selectedUpgradePackage}
          userId={user?.id || ''}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}
    </div>
  );
};

export default SubscriptionManagement;
