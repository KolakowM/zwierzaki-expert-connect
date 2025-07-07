
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Briefcase, Tag, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { getUserUsageStats } from "@/services/subscriptionService";
import { getUserEffectiveLimits } from "@/services/addonService";

const UsageStatsCard = () => {
  const { user } = useAuth();

  const { data: usageStats, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['user-usage-stats', user?.id],
    queryFn: () => user?.id ? getUserUsageStats(user.id) : Promise.resolve(null),
    enabled: !!user?.id,
  });

  const { data: effectiveLimits, isLoading: isLoadingLimits } = useQuery({
    queryKey: ['user-effective-limits', user?.id],
    queryFn: () => user?.id ? getUserEffectiveLimits(user.id) : Promise.resolve(null),
    enabled: !!user?.id,
  });

  if (isLoadingUsage || isLoadingLimits) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wykorzystanie zasobów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Ładowanie statystyk...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!usageStats || !effectiveLimits) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wykorzystanie zasobów</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Brak danych o wykorzystaniu zasobów
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Klienci",
      icon: Users,
      current: usageStats.clients_count,
      max: effectiveLimits.max_clients,
      color: "bg-blue-500",
    },
    {
      label: "Zwierzęta",
      icon: Heart,
      current: usageStats.pets_count,
      max: effectiveLimits.max_pets,
      color: "bg-red-500",
    },
    {
      label: "Usługi",
      icon: Briefcase,
      current: usageStats.services_count,
      max: effectiveLimits.max_services,
      color: "bg-green-500",
    },
    {
      label: "Specjalizacje",
      icon: Tag,
      current: usageStats.specializations_count,
      max: effectiveLimits.max_specializations,
      color: "bg-purple-500",
    },
  ];

  const getUsagePercentage = (current: number, max: number) => {
    return max > 0 ? (current / max) * 100 : 0;
  };

  const getUsageBadge = (current: number, max: number) => {
    const percentage = getUsagePercentage(current, max);
    if (percentage >= 100) {
      return <Badge variant="destructive">Limit osiągnięty</Badge>;
    } else if (percentage >= 80) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Bliski limitu</Badge>;
    }
    return <Badge variant="outline">W normie</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wykorzystanie zasobów</CardTitle>
        <CardDescription>
          Aktualnie wykorzystywane limity (z uwzględnieniem dodatków)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat) => {
          const percentage = getUsagePercentage(stat.current, stat.max);
          const Icon = stat.icon;
          
          return (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{stat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {stat.current}/{stat.max}
                  </span>
                  {getUsageBadge(stat.current, stat.max)}
                </div>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{percentage.toFixed(1)}% wykorzystane</span>
                  {percentage >= 80 && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Rozważ dokupienie dodatków</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default UsageStatsCard;
