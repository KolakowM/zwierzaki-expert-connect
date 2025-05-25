
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LimitExceededAlertProps {
  actionType: string;
  current: number;
  max: number;
  packageName: string;
  className?: string;
}

const LimitExceededAlert = ({ 
  actionType, 
  current, 
  max, 
  packageName, 
  className 
}: LimitExceededAlertProps) => {
  const navigate = useNavigate();

  const getActionName = (actionType: string): string => {
    switch (actionType) {
      case 'clients': return 'klientów';
      case 'pets': return 'zwierząt';
      case 'services': return 'usług';
      case 'specializations': return 'specjalizacji';
      default: return 'elementów';
    }
  };

  return (
    <Alert className={`border-amber-200 bg-amber-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="text-amber-800">
          <strong>Limit osiągnięty!</strong>
          <br />
          Twój pakiet {packageName} pozwala na {max} {getActionName(actionType)}. 
          Aktualnie masz {current}.
        </div>
        <Button 
          size="sm" 
          onClick={() => navigate('/dashboard?tab=subscription')}
          className="ml-4 bg-amber-600 hover:bg-amber-700"
        >
          <Crown className="h-4 w-4 mr-1" />
          Ulepsz pakiet
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default LimitExceededAlert;
