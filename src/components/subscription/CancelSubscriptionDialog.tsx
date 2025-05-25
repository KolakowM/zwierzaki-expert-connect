
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { cancelSubscription } from "@/services/subscriptionService";
import { ActiveSubscription } from "@/types/subscription";

interface CancelSubscriptionDialogProps {
  activeSubscription: ActiveSubscription;
  onCancelSuccess: () => void;
}

const CancelSubscriptionDialog = ({ activeSubscription, onCancelSuccess }: CancelSubscriptionDialogProps) => {
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await cancelSubscription(activeSubscription.subscription_id);
      toast({
        title: "Pakiet anulowany",
        description: "Twój pakiet zostanie anulowany na koniec okresu rozliczeniowego.",
      });
      onCancelSuccess();
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Anuluj pakiet
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz anulować pakiet?</AlertDialogTitle>
          <AlertDialogDescription>
            Pakiet zostanie anulowany na koniec okresu rozliczeniowego. 
            Będziesz mógł korzystać z funkcji do {activeSubscription.end_date ? new Date(activeSubscription.end_date).toLocaleDateString('pl-PL') : 'końca okresu'}.
            Po tym czasie Twoje konto zostanie przełączone na plan Trial.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancelSubscription}
            disabled={isCancelling}
          >
            {isCancelling ? 'Anulowanie...' : 'Potwierdź anulowanie'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelSubscriptionDialog;
