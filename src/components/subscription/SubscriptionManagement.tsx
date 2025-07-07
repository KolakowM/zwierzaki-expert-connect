
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { getUserActiveSubscription } from "@/services/subscriptionService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CreditCard, Package } from "lucide-react";

// Import existing components
import CurrentPackageCard from "./CurrentPackageCard";
import AvailablePackagesCard from "./AvailablePackagesCard";
import UsageStatsCard from "./UsageStatsCard";

// Import new add-ons component
import AddonManagement from "../addons/AddonManagement";

const SubscriptionManagement = () => {
  const { user } = useAuth();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: () => user?.id ? getUserActiveSubscription(user.id) : Promise.resolve(null),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Ładowanie danych subskrypcji...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Zarządzanie subskrypcją</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Przegląd
          </TabsTrigger>
          <TabsTrigger value="addons" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Dodatki
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Pakiety
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <CurrentPackageCard />
            <UsageStatsCard />
          </div>
        </TabsContent>

        <TabsContent value="addons" className="space-y-6">
          <AddonManagement />
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <AvailablePackagesCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionManagement;
