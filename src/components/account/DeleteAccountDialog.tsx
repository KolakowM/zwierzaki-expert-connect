
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

interface DeleteAccountDialogProps {
  onDeleteAccount: () => void;
}

export function DeleteAccountDialog({ onDeleteAccount }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Card className="mt-6 border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600 my-[5px]">Muszę zakończyć współpracę</CardTitle>
        <CardDescription>
          Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Usuń konto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Czy na pewno chcesz usunąć konto?</DialogTitle>
              <DialogDescription>
                Ta akcja jest nieodwracalna. Spowoduje trwałe usunięcie Twojego konta i wszystkich 
                powiązanych z nim danych, w tym profilu, ustawień i historii działań.
              </DialogDescription>
            </DialogHeader>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <DialogClose asChild>
                <Button variant="outline">Anuluj</Button>
              </DialogClose>
              <Button variant="destructive" onClick={onDeleteAccount}>
                Tak, usuń moje konto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
