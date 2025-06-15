
import { ActionType, PackageLimitError } from "@/types/subscription";
import { checkPackageLimits } from "@/services/subscriptionService";

export interface LimitCheckOptions {
  userId: string;
  actionType: ActionType;
  softCheck?: boolean;
}

export const withPackageLimitCheck = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: LimitCheckOptions | ((...args: T) => LimitCheckOptions)
) => {
  return async (...args: T): Promise<R> => {
    const limitOptions = typeof options === 'function' ? options(...args) : options;
    
    try {
      // Perform hard check (will throw exception if limit exceeded)
      await checkPackageLimits(limitOptions.userId, limitOptions.actionType, false);
      
      // If we reach here, limit check passed - proceed with the operation
      return await fn(...args);
    } catch (error) {
      // Re-throw PackageLimitError with additional context
      if (error instanceof PackageLimitError) {
        throw error;
      }
      
      // Handle other database errors that might contain limit exceeded messages
      if (error instanceof Error && error.message?.includes('PACKAGE_LIMIT_EXCEEDED:')) {
        const errorMessage = error.message.replace('PACKAGE_LIMIT_EXCEEDED: ', '');
        throw new PackageLimitError(errorMessage, limitOptions.actionType, 0, 0, 'Unknown');
      }
      
      // Re-throw other errors
      throw error;
    }
  };
};

// Helper function to handle limit errors in UI
export const handlePackageLimitError = (error: unknown, onUpgrade?: () => void) => {
  if (error instanceof PackageLimitError) {
    return {
      isLimitError: true,
      message: error.message,
      actionType: error.actionType,
      currentCount: error.currentCount,
      maxAllowed: error.maxAllowed,
      packageName: error.packageName,
      onUpgrade
    };
  }
  
  return {
    isLimitError: false,
    message: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'
  };
};
