
import { ActionType } from '@/types/subscription';
import { checkPackageLimits } from '@/services/subscriptionService';

export class PackageLimitError extends Error {
  constructor(
    message: string,
    public actionType: ActionType,
    public currentCount: number,
    public maxAllowed: number,
    public packageName: string
  ) {
    super(message);
    this.name = 'PackageLimitError';
  }
}

export const validatePackageLimit = async (
  userId: string, 
  actionType: ActionType
): Promise<void> => {
  try {
    const limits = await checkPackageLimits(userId, actionType);
    
    if (!limits || !limits.can_perform_action) {
      throw new PackageLimitError(
        `Osiągnięto limit ${getActionLabel(actionType)} (${limits?.current_count || 0}/${limits?.max_allowed || 0}) w pakiecie ${limits?.package_name || 'Trial'}`,
        actionType,
        limits?.current_count || 0,
        limits?.max_allowed || 0,
        limits?.package_name || 'Trial'
      );
    }
  } catch (error) {
    if (error instanceof PackageLimitError) {
      throw error;
    }
    console.error('Error checking package limits:', error);
    // W przypadku błędu API, pozwalamy na wykonanie akcji
  }
};

const getActionLabel = (actionType: ActionType): string => {
  switch (actionType) {
    case 'clients': return 'klientów';
    case 'pets': return 'zwierząt';
    case 'services': return 'usług';
    case 'specializations': return 'specjalizacji';
    default: return 'elementów';
  }
};
