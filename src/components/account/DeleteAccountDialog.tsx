
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

interface DeleteAccountDialogProps {
  onDeleteAccount: (password: string) => Promise<void>;
}

export function DeleteAccountDialog({ onDeleteAccount }: DeleteAccountDialogProps) {
  console.log("DeleteAccountDialog: Rendered with onDeleteAccount:", !!onDeleteAccount);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  console.log("DeleteAccountDialog: Current state - open:", open, "password length:", password.length);

  const handleDelete = async () => {
    console.log("DeleteAccountDialog: handleDelete called");
    if (!password.trim()) {
      console.log("DeleteAccountDialog: No password provided");
      return;
    }
    
    try {
      setIsDeleting(true);
      console.log("DeleteAccountDialog: Calling onDeleteAccount with password");
      await onDeleteAccount(password);
      setOpen(false);
    } catch (error) {
      console.error("DeleteAccountDialog: Error during deletion:", error);
      // Error is handled by the parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPassword("");
    setIsDeleting(false);
  };
  
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
            <Button 
              variant="destructive"
              onClick={() => {
                console.log("DeleteAccountDialog: Button clicked, current open state:", open);
                console.log("DeleteAccountDialog: Setting open to true");
                setOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Usuń konto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Czy na pewno chcesz usunąć konto?</DialogTitle>
              <DialogDescription>
                Ta akcja jest nieodwracalna. Spowoduje trwałe usunięcie Twojego konta i wszystkich 
                powiązanych z nim danych, w tym:
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-700 text-sm">
              <p className="font-semibold">Zostaną usunięte:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Profil użytkownika i specjalisty</li>
                <li>Wszyscy klienci i ich dane</li>
                <li>Wszystkie zwierzęta i ich dokumentacja</li>
                <li>Historia wizyt i programy opieki</li>
                <li>Zdjęcia i załączniki</li>
                <li>Subskrypcje i dodatki</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Potwierdź hasłem aby kontynuować:</Label>
              <Input
                id="password"
                type="password"
                placeholder="Wprowadź swoje hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isDeleting}
              />
            </div>

            <Separator className="my-4" />
            <div className="flex justify-between">
              <DialogClose asChild>
                <Button variant="outline" disabled={isDeleting}>Anuluj</Button>
              </DialogClose>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={!password.trim() || isDeleting}
              >
                {isDeleting ? "Usuwanie..." : "Tak, usuń moje konto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
