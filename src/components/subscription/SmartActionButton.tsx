
import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { usePackageLimitValidator } from '@/hooks/usePackageLimitValidator';
import { ActionType } from '@/types/subscription';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import LimitExceededDialog from './LimitExceededDialog';
import LimitWarning from './LimitWarning';

interface SmartActionButtonProps {
  actionType: ActionType;
  onAction: () => void | Promise<void>;
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  onUpgrade?: () => void;
  showWarnings?: boolean;
}

const SmartActionButton = ({
  actionType,
  onAction,
  children,
  variant = "default",
  size = "default",
  className,
  disabled = false,
  onUpgrade,
  showWarnings = true
}: SmartActionButtonProps) => {
  const { user } = useAuth();
  const [isExecuting, setIsExecuting] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  
  const {
    validateAction,
    canPerform,
    currentCount,
    maxAllowed,
    packageName,
    usagePercentage,
    isLoading,
    isAtSoftLimit
  } = usePackageLimitValidator(actionType);

  const handleClick = async () => {
    if (!user || isExecuting || disabled) return;

    const validation = validateAction();
    
    if (!validation.canProceed) {
      if (validation.reason === 'limit_exceeded') {
        setShowLimitDialog(true);
        return;
      }
    }

    try {
      setIsExecuting(true);
      await onAction();
    } catch (error) {
      console.error('Action execution failed:', error);
      // Handle error appropriately
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Ładowanie...
      </Button>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {showWarnings && isAtSoftLimit && canPerform && (
          <LimitWarning
            actionType={actionType}
            currentCount={currentCount}
            maxAllowed={maxAllowed}
            packageName={packageName}
            usagePercentage={usagePercentage}
            onUpgrade={onUpgrade}
          />
        )}
        
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={handleClick}
          disabled={disabled || isExecuting}
        >
          {isExecuting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {children}
        </Button>
      </div>

      <LimitExceededDialog
        isOpen={showLimitDialog}
        onClose={() => setShowLimitDialog(false)}
        actionType={actionType}
        currentCount={currentCount}
        maxAllowed={maxAllowed}
        packageName={packageName}
        onUpgrade={onUpgrade}
      />
    </>
  );
};

export default SmartActionButton;
