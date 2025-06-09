
import { AlertTriangle, Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActionType } from "@/types/subscription";

interface LimitExceededDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

const LimitExceededDialog = ({
  isOpen,
  onClose,
  actionType,
  currentCount,
  maxAllowed,
  packageName,
  onUpgrade
}: LimitExceededDialogProps) => {
  const actionLabel = getActionLabel(actionType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-red-900">
                Osiągnięto limit pakietu
              </DialogTitle>
              <DialogDescription className="text-red-700">
                Nie można dodać więcej {actionLabel}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">
              Używasz <span className="font-medium">{currentCount}/{maxAllowed}</span> dostępnych {actionLabel} w pakiecie <span className="font-medium">{packageName}</span>.
            </p>
          </div>
          
          <p className="text-sm text-gray-600">
            Aby dodać więcej {actionLabel}, ulepsz swój pakiet do wyższego planu z większymi limitami.
          </p>
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
            <Button variant="outline" onClick={onClose}>
              Anuluj
            </Button>
            {onUpgrade && (
              <Button onClick={onUpgrade} className="w-full sm:w-auto">
                <Crown className="h-4 w-4 mr-2" />
                Ulepsz pakiet
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LimitExceededDialog;
