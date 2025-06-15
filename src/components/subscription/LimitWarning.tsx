
import { AlertTriangle, Crown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ActionType } from "@/types/subscription";

interface LimitWarningProps {
  actionType: ActionType;
  currentCount: number;
  maxAllowed: number;
  packageName: string;
  usagePercentage: number;
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

const LimitWarning = ({ 
  actionType, 
  currentCount, 
  maxAllowed, 
  packageName,
  usagePercentage,
  onUpgrade 
}: LimitWarningProps) => {
  const actionLabel = getActionLabel(actionType);

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium text-orange-800">
            Zbliżasz się do limitu {actionLabel}
          </p>
          <p className="text-sm text-orange-700">
            Używasz {usagePercentage}% dostępnego limitu ({currentCount}/{maxAllowed}) w pakiecie {packageName}.
          </p>
        </div>
        {onUpgrade && (
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="ml-4 whitespace-nowrap"
            variant="outline"
          >
            <Crown className="h-4 w-4 mr-1" />
            Ulepsz
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LimitWarning;
