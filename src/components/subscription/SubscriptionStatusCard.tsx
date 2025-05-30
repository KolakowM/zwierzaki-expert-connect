
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, CreditCard } from "lucide-react";
import { ActiveSubscription } from "@/types/subscription";

interface SubscriptionStatusCardProps {
  subscription: ActiveSubscription | null;
  onManageSubscription: () => void;
  onCancelSubscription: () => void;
}

const SubscriptionStatusCard = ({
  subscription,
  onManageSubscription,
  onCancelSubscription
}: SubscriptionStatusCardProps) => {
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

  // For trial users, we don't have a subscription object, so we use default values
  const status = subscription ? 'active' : 'trial';
  const packageName = subscription?.package_name || 'Wersja próbna';
  const hasActiveSubscription = subscription?.subscription_id && status === 'active';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Obecny pakiet</CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
            {getStatusText(status)}
          </Badge>
        </div>
        <CardDescription>
          {packageName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status subskrypcji:</span>
            <span className="text-sm">{getStatusText(status)}</span>
          </div>
          
          {subscription?.end_date && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data wygaśnięcia:</span>
              <span className="text-sm">{formatDate(subscription.end_date)}</span>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button onClick={onManageSubscription}>
              <CreditCard className="mr-2 h-4 w-4" />
              Zarządzaj pakietem
            </Button>
            
            {hasActiveSubscription && (
              <Button variant="outline" onClick={onCancelSubscription}>
                Anuluj subskrypcję
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusCard;
