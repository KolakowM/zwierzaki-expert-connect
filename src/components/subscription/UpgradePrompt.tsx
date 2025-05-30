
import { AlertTriangle, Crown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ActionType } from "@/types/subscription";

interface UpgradePromptProps {
  actionType: ActionType;
  currentCount: number;
  maxAllowed: number;
  packageName: string;
  onUpgrade?: () => void;
}

const getActionLabel = (actionType: ActionType): string => {
  switch (actionType) {
    case 'clients':
      return 'klientów';
    case 'pets':
      return 'zwierząt';
    case 'services':
      return 'usług';
    case 'specializations':
      return 'specjalizacji';
    default:
      return 'elementów';
  }
};

const UpgradePrompt = ({ 
  actionType, 
  currentCount, 
  maxAllowed, 
  packageName,
  onUpgrade 
}: UpgradePromptProps) => {
  const actionLabel = getActionLabel(actionType);

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium text-amber-800">
            Osiągnięto limit {actionLabel}
          </p>
          <p className="text-sm text-amber-700">
            Masz {currentCount}/{maxAllowed} {actionLabel} w pakiecie {packageName}. 
            Ulepsz pakiet, aby dodać więcej.
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={onUpgrade}
          className="ml-4 whitespace-nowrap"
        >
          <Crown className="h-4 w-4 mr-1" />
          Ulepsz
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default UpgradePrompt;
