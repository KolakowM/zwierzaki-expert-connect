
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Heart, Briefcase, Award } from "lucide-react";
import { ActiveSubscription, UsageStats } from "@/types/subscription";

interface UsageStatsCardProps {
  subscription: ActiveSubscription | null;
  usageStats: UsageStats | null;
}

const UsageStatsCard = ({ subscription, usageStats }: UsageStatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Wykorzystanie zasobów
        </CardTitle>
        <CardDescription>
          Twoje obecne wykorzystanie w stosunku do limitów pakietu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clients Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Klienci
              </span>
              <span className="text-sm">
                {usageStats?.clients_count || 0} / {subscription?.max_clients || 5}
              </span>
            </div>
            <Progress 
              value={((usageStats?.clients_count || 0) / (subscription?.max_clients || 5)) * 100} 
              className="h-2"
            />
          </div>

          {/* Pets Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Zwierzęta
              </span>
              <span className="text-sm">
                {usageStats?.pets_count || 0} / {subscription?.max_pets || 10}
              </span>
            </div>
            <Progress 
              value={((usageStats?.pets_count || 0) / (subscription?.max_pets || 10)) * 100} 
              className="h-2"
            />
          </div>

          {/* Services Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Usługi
              </span>
              <span className="text-sm">
                {usageStats?.services_count || 0} / {subscription?.max_services || 3}
              </span>
            </div>
            <Progress 
              value={((usageStats?.services_count || 0) / (subscription?.max_services || 3)) * 100} 
              className="h-2"
            />
          </div>

          {/* Specializations Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Specjalizacje
              </span>
              <span className="text-sm">
                {usageStats?.specializations_count || 0} / {subscription?.max_specializations || 2}
              </span>
            </div>
            <Progress 
              value={((usageStats?.specializations_count || 0) / (subscription?.max_specializations || 2)) * 100} 
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStatsCard;
