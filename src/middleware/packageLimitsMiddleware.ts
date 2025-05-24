
import { checkPackageLimits } from '@/services/subscriptionService';
import { ActionType } from '@/types/subscription';

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

export const validatePackageLimit = async (userId: string, actionType: ActionType): Promise<void> => {
  try {
    const limits = await checkPackageLimits(userId, actionType);
    
    if (!limits) {
      throw new Error('Nie udało się sprawdzić limitów pakietu');
    }

    if (!limits.can_perform_action) {
      throw new PackageLimitError(
        `Osiągnięto limit ${actionType} (${limits.current_count}/${limits.max_allowed}) w pakiecie ${limits.package_name}`,
        actionType,
        limits.current_count,
        limits.max_allowed,
        limits.package_name
      );
    }
  } catch (error) {
    if (error instanceof PackageLimitError) {
      throw error;
    }
    console.error('Error checking package limits:', error);
    throw new Error('Nie udało się sprawdzić limitów pakietu');
  }
};
