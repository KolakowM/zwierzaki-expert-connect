
import { ReactNode } from 'react';
import { useCanPerformAction } from '@/hooks/usePackageLimits';
import { ActionType } from '@/types/subscription';
import UpgradePrompt from './UpgradePrompt';

interface PackageLimitGuardProps {
  actionType: ActionType;
  children: ReactNode;
  fallback?: ReactNode;
  onUpgrade?: () => void;
  showPrompt?: boolean;
}

const PackageLimitGuard = ({ 
  actionType, 
  children, 
  fallback,
  onUpgrade,
  showPrompt = true 
}: PackageLimitGuardProps) => {
  const { canPerform, currentCount, maxAllowed, packageName, isLoading, isAtLimit } = useCanPerformAction(actionType);

  if (isLoading) {
    return <div className="animate-pulse h-8 bg-gray-200 rounded"></div>;
  }

  if (!canPerform && isAtLimit) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showPrompt) {
      return (
        <UpgradePrompt
          actionType={actionType}
          currentCount={currentCount}
          maxAllowed={maxAllowed}
          packageName={packageName}
          onUpgrade={onUpgrade}
        />
      );
    }

    return null;
  }

  return <>{children}</>;
};

export default PackageLimitGuard;
