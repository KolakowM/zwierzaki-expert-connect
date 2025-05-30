
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Package, 
  Users, 
  Heart, 
  Briefcase, 
  Award,
  ArrowUpCircle,
  Calendar,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PackageUpgradeDialog from "./PackageUpgradeDialog";
import CancelSubscriptionDialog from "./CancelSubscriptionDialog";
import { useUserSubscription } from "@/hooks/useUserSubscription";

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const { 
    data: subscription, 
    isLoading: subscriptionLoading 
  } = useUserSubscription();

  // Fetch usage statistics
  const { data: usageStats, isLoading: usageLoading } = useQuery({
    queryKey: ['userUsageStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase.rpc('get_user_usage_stats', {
        p_user_id: user.id
      });
      
      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!user?.id,
  });

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
    if (subscription?.subscription_id) {
      setShowUpgradeDialog(true);
    } else {
      // User doesn't have a subscription, show upgrade options
      setShowUpgradeDialog(true);
    }
  };

  const isLoading = subscriptionLoading || usageLoading;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'expired': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return 'Aktywna';
      case 'trial': return 'Wersja próbna';
      case 'expired': return 'Wygasła';
      case 'cancelled': return 'Anulowana';
      default: return 'Nieznany';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Brak daty';
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-48 bg-muted/50 rounded"></div>
              <div className="h-4 w-32 bg-muted/50 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>Obecny pakiet</CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(subscription?.status || 'trial')}`}></div>
              {getStatusText(subscription?.status || 'trial')}
            </Badge>
          </div>
          <CardDescription>
            {subscription?.package_name || 'Wersja próbna'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status subskrypcji:</span>
              <span className="text-sm">{getStatusText(subscription?.status || 'trial')}</span>
            </div>
            
            {subscription?.end_date && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data wygaśnięcia:</span>
                <span className="text-sm">{formatDate(subscription.end_date)}</span>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleManageSubscription}>
                <CreditCard className="mr-2 h-4 w-4" />
                Zarządzaj pakietem
              </Button>
              
              {subscription?.subscription_id && subscription?.status === 'active' && (
                <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
                  Anuluj subskrypcję
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
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

      {/* Package Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Funkcje pakietu
          </CardTitle>
          <CardDescription>
            Dostępne funkcje w Twoim obecnym pakiecie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              {subscription?.can_access_carousel ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
              <span className="text-sm">Dostęp do karuzeli</span>
            </div>
            
            <div className="flex items-center gap-2">
              {subscription?.can_appear_in_catalog ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
              <span className="text-sm">Widoczność w katalogu</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <PackageUpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        packages={packages}
        currentPackage={subscription}
      />

      {/* Cancel Dialog */}
      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        subscription={subscription}
      />
    </div>
  );
};

export default SubscriptionManagement;
