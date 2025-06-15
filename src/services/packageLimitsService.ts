
import { useAuth } from '@/contexts/AuthProvider';
import { ActionType, PackageLimitError } from '@/types/subscription';
import { checkPackageLimits } from '@/services/subscriptionService';

// Service layer wrapper that enforces package limits
export const withPackageLimitValidation = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  actionType: ActionType
) => {
  return async (...args: T): Promise<R> => {
    const userId = (args[0] as any)?.userId || (args[0] as any)?.user_id;
    
    if (!userId) {
      throw new Error('User ID is required for package limit validation');
    }

    try {
      // Perform hard check - will throw exception if limit exceeded
      await checkPackageLimits(userId, actionType, false);
      
      // If we reach here, limit check passed - proceed with the operation
      return await fn(...args);
    } catch (error) {
      // Re-throw PackageLimitError or database errors containing limit info
      if (error instanceof PackageLimitError) {
        throw error;
      }
      
      if (error instanceof Error && error.message?.includes('PACKAGE_LIMIT_EXCEEDED:')) {
        const errorMessage = error.message.replace('PACKAGE_LIMIT_EXCEEDED: ', '');
        throw new PackageLimitError(errorMessage, actionType, 0, 0, 'Unknown');
      }
      
      // Re-throw other errors
      throw error;
    }
  };
};

// Helper function to validate action before UI interaction
export const validateActionBeforeExecution = async (
  userId: string,
  actionType: ActionType
): Promise<{ canProceed: boolean; reason?: string; message?: string }> => {
  try {
    const limits = await checkPackageLimits(userId, actionType, true);
    
    if (!limits?.can_perform_action) {
      return {
        canProceed: false,
        reason: 'limit_exceeded',
        message: limits?.error_message || 'Osiągnięto limit pakietu'
      };
    }

    if (limits.is_at_soft_limit) {
      return {
        canProceed: true,
        reason: 'approaching_limit',
        message: `Zbliżasz się do limitu (${limits.usage_percentage}% wykorzystania)`
      };
    }

    return { canProceed: true };
  } catch (error) {
    console.error('Error validating action:', error);
    return {
      canProceed: false,
      reason: 'error',
      message: 'Wystąpił błąd podczas sprawdzania limitów'
    };
  }
};
