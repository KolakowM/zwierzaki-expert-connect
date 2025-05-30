
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { cancelSubscription } from "@/services/subscriptionService";

interface ActiveSubscription {
  id?: string;
  subscription_id?: string;
  end_date?: string;
  status?: string;
}

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSubscription: ActiveSubscription | null;
  onCancelSuccess: () => void;
}

const CancelSubscriptionDialog = ({ 
  open, 
  onOpenChange, 
  activeSubscription, 
  onCancelSuccess 
}: CancelSubscriptionDialogProps) => {
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    if (!activeSubscription?.subscription_id) return;
    
    setIsCancelling(true);
    try {
      await cancelSubscription(activeSubscription.subscription_id);
      toast({
        title: "Pakiet anulowany",
        description: "Twój pakiet zostanie anulowany na koniec okresu rozliczeniowego.",
      });
      onCancelSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się anulować pakietu. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Anulowanie pakietu
          </DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz anulować pakiet? 
            {activeSubscription?.end_date && (
              <>
                {' '}Pakiet zostanie anulowany na koniec okresu rozliczeniowego. 
                Będziesz mógł korzystać z funkcji do {new Date(activeSubscription.end_date).toLocaleDateString('pl-PL')}.
                Po tym czasie Twoje konto zostanie przełączone na plan Trial.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Anuluj
          </Button>
          <Button 
            variant="destructive"
            onClick={handleCancelSubscription}
            disabled={isCancelling}
          >
            {isCancelling ? 'Anulowanie...' : 'Potwierdź anulowanie'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;
