
import { AlertTriangle, Crown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ActionType } from "@/types/subscription";
import { useNavigate } from "react-router-dom";

interface LimitExceededAlertProps {
  actionType: ActionType;
  currentCount: number;
  maxAllowed: number;
  packageName: string;
  isOverLimit?: boolean;
  onUpgrade?: () => void;
}

const getActionLabel = (actionType: ActionType): string => {
  switch (actionType) {
    case 'clients': return 'klientów';
    case 'pets': return 'zwierząt';
    case 'services': return 'usług';
    case 'specializations': return 'specjalizacji';
    default: return 'elementów';
  }
};

const LimitExceededAlert = ({ 
  actionType, 
  currentCount, 
  maxAllowed, 
  packageName,
  isOverLimit = false,
  onUpgrade 
}: LimitExceededAlertProps) => {
  const navigate = useNavigate();
  const actionLabel = getActionLabel(actionType);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/dashboard?tab=subscription');
    }
  };

  return (
    <Alert className={isOverLimit ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}>
      <AlertTriangle className={`h-4 w-4 ${isOverLimit ? 'text-red-600' : 'text-amber-600'}`} />
      <AlertTitle className={isOverLimit ? 'text-red-800' : 'text-amber-800'}>
        {isOverLimit ? 'Przekroczono limit' : 'Osiągnięto limit'} {actionLabel}
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isOverLimit ? 'text-red-700' : 'text-amber-700'}`}>
            {isOverLimit 
              ? `Masz ${currentCount} ${actionLabel}, ale pakiet ${packageName} pozwala na maksymalnie ${maxAllowed}. Niektóre funkcje mogą być ograniczone.`
              : `Masz ${currentCount}/${maxAllowed} ${actionLabel} w pakiecie ${packageName}.`
            }
          </p>
          {!isOverLimit && (
            <p className={`text-sm ${isOverLimit ? 'text-red-700' : 'text-amber-700'}`}>
              Ulepsz pakiet, aby dodać więcej.
            </p>
          )}
        </div>
        <Button 
          size="sm" 
          onClick={handleUpgrade}
          className="ml-4 whitespace-nowrap"
          variant={isOverLimit ? "destructive" : "default"}
        >
          <Crown className="h-4 w-4 mr-1" />
          {isOverLimit ? 'Napraw limit' : 'Ulepsz'}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default LimitExceededAlert;
