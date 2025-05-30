
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthProvider';
import { checkPackageLimits } from '@/services/subscriptionService';
import { ActionType, PackageLimits } from '@/types/subscription';

export const usePackageLimits = (actionType: ActionType) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['packageLimits', user?.id, actionType],
    queryFn: () => checkPackageLimits(user!.id, actionType),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCanPerformAction = (actionType: ActionType) => {
  const { data: limits, isLoading } = usePackageLimits(actionType);
  
  return {
    canPerform: limits?.can_perform_action ?? false,
    currentCount: limits?.current_count ?? 0,
    maxAllowed: limits?.max_allowed ?? 0,
    packageName: limits?.package_name ?? 'Trial',
    isLoading,
    isAtLimit: limits ? limits.current_count >= limits.max_allowed : false,
  };
};
