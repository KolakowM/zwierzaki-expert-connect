
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthProvider';
import { checkPackageLimits } from '@/services/subscriptionService';
import { ActionType } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

export const usePackageLimitValidator = (actionType: ActionType) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: limits, isLoading } = useQuery({
    queryKey: ['packageLimits', user?.id, actionType],
    queryFn: () => checkPackageLimits(user!.id, actionType),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minuty cache
  });

  const validateAction = (showToast: boolean = true): boolean => {
    if (!limits) return false;
    
    const canPerform = limits.can_perform_action;
    
    if (!canPerform && showToast) {
      toast({
        title: "Limit pakietu osiągnięty",
        description: `Twój pakiet ${limits.package_name} pozwala na maksymalnie ${limits.max_allowed} ${getActionName(actionType)}. Aktualnie masz ${limits.current_count}.`,
        variant: "destructive",
      });
    }
    
    return canPerform;
  };

  const getActionName = (actionType: ActionType): string => {
    switch (actionType) {
      case 'clients': return 'klientów';
      case 'pets': return 'zwierząt';
      case 'services': return 'usług';
      case 'specializations': return 'specjalizacji';
      default: return 'elementów';
    }
  };

  const getLimitInfo = () => {
    if (!limits) return null;
    
    return {
      current: limits.current_count,
      max: limits.max_allowed,
      canPerform: limits.can_perform_action,
      packageName: limits.package_name,
      remaining: limits.max_allowed - limits.current_count,
      percentage: Math.round((limits.current_count / limits.max_allowed) * 100)
    };
  };

  return {
    validateAction,
    getLimitInfo,
    isLoading,
    limits
  };
};
