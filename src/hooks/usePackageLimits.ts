
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthProvider';
import { checkPackageLimits } from '@/services/subscriptionService';
import { ActionType, PackageLimits } from '@/types/subscription';

export const usePackageLimits = (actionType: ActionType, softCheck: boolean = true) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['packageLimits', user?.id, actionType, softCheck],
    queryFn: () => checkPackageLimits(user!.id, actionType, softCheck),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCanPerformAction = (actionType: ActionType) => {
  const { data: limits, isLoading } = usePackageLimits(actionType, true);
  
  return {
    canPerform: limits?.can_perform_action ?? false,
    currentCount: limits?.current_count ?? 0,
    maxAllowed: limits?.max_allowed ?? 0,
    packageName: limits?.package_name ?? 'Trial',
    usagePercentage: limits?.usage_percentage ?? 0,
    isAtSoftLimit: limits?.is_at_soft_limit ?? false,
    errorMessage: limits?.error_message,
    isLoading,
    isAtLimit: limits ? limits.current_count >= limits.max_allowed : false,
    isNearLimit: limits ? limits.usage_percentage >= 80 : false,
  };
};
