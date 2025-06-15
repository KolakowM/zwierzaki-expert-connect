
import { ReactNode } from 'react';
import { useCanPerformAction } from '@/hooks/usePackageLimits';
import { ActionType } from '@/types/subscription';
import UpgradePrompt from './UpgradePrompt';
import LimitWarning from './LimitWarning';

interface PackageLimitGuardProps {
  actionType: ActionType;
  children: ReactNode;
  fallback?: ReactNode;
  onUpgrade?: () => void;
  showPrompt?: boolean;
  showWarnings?: boolean;
}

const PackageLimitGuard = ({ 
  actionType, 
  children, 
  fallback,
  onUpgrade,
  showPrompt = true,
  showWarnings = true 
}: PackageLimitGuardProps) => {
  const { 
    canPerform, 
    currentCount, 
    maxAllowed, 
    packageName, 
    usagePercentage,
    isAtSoftLimit,
    isLoading, 
    isAtLimit,
    isNearLimit 
  } = useCanPerformAction(actionType);

  if (isLoading) {
    return <div className="animate-pulse h-8 bg-gray-200 rounded"></div>;
  }

  // Show warning for users approaching limits (80%+)
  if (showWarnings && isAtSoftLimit && !isAtLimit) {
    return (
      <div className="space-y-3">
        <LimitWarning
          actionType={actionType}
          currentCount={currentCount}
          maxAllowed={maxAllowed}
          packageName={packageName}
          usagePercentage={usagePercentage}
          onUpgrade={onUpgrade}
        />
        {children}
      </div>
    );
  }

  // Block action if at limit
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
