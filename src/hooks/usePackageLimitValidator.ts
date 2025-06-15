
import { useCanPerformAction } from './usePackageLimits';
import { ActionType } from '@/types/subscription';

export const usePackageLimitValidator = (actionType: ActionType) => {
  const { 
    canPerform, 
    currentCount, 
    maxAllowed, 
    packageName, 
    usagePercentage,
    isAtSoftLimit,
    isLoading, 
    isAtLimit,
    errorMessage 
  } = useCanPerformAction(actionType);

  const validateAction = () => {
    if (isLoading) return { canProceed: false, reason: 'loading' };
    
    if (!canPerform) {
      return {
        canProceed: false,
        reason: 'limit_exceeded',
        message: errorMessage || `Osiągnięto limit ${getActionLabel(actionType)} (${currentCount}/${maxAllowed}) w pakiecie ${packageName}. Ulepsz pakiet, aby dodać więcej.`
      };
    }

    if (isAtSoftLimit) {
      return {
        canProceed: true,
        reason: 'approaching_limit',
        message: `Zbliżasz się do limitu ${getActionLabel(actionType)} (${usagePercentage}% wykorzystania). Rozważ ulepszenie pakietu.`
      };
    }

    return { canProceed: true };
  };

  const getActionLabel = (type: ActionType): string => {
    switch (type) {
      case 'clients': return 'klientów';
      case 'pets': return 'zwierząt';
      case 'services': return 'usług';
      case 'specializations': return 'specjalizacji';
      default: return 'elementów';
    }
  };

  return {
    validateAction,
    canPerform,
    currentCount,
    maxAllowed,
    packageName,
    usagePercentage,
    isLoading,
    isAtLimit,
    isAtSoftLimit,
    isOverLimit: currentCount > maxAllowed,
    errorMessage
  };
};
