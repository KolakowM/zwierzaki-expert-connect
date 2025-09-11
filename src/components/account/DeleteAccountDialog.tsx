
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Trash2, Copy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface DeleteAccountDialogProps {}

export function DeleteAccountDialog({}: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const adminEmail = "admin@petsflow.pl";
  const emailSubject = "Usuwam konto";
  const userEmail = user?.email || "";

  const copyEmail = () => {
    navigator.clipboard.writeText(adminEmail);
    toast({
      title: "Skopiowano",
      description: "Adres email został skopiowany do schowka",
    });
  };

  const openMailClient = () => {
    const mailto = `mailto:${adminEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(`Dzień dobry,\n\nProszę o usunięcie mojego konta w systemie PetsFlow.\n\nMój adres email: ${userEmail}\n\nPozdrawiam`)}`;
    window.open(mailto);
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
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Usuń konto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Usunięcie konta</DialogTitle>
              <DialogDescription>
                Aby usunąć swoje konto, wyślij maila na adres administratora z żądaniem usunięcia konta.
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700 text-sm">
              <p className="font-semibold mb-2">Zostaną usunięte:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Profil użytkownika i specjalisty</li>
                <li>Wszyscy klienci i ich dane</li>
                <li>Wszystkie zwierzęta i ich dokumentacja</li>
                <li>Historia wizyt i programy opieki</li>
                <li>Zdjęcia i załączniki</li>
                <li>Subskrypcje i dodatki</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Twój adres email:</p>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Wyślij maila na adres:</p>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm flex-1">{adminEmail}</code>
                  <Button size="sm" variant="outline" onClick={copyEmail}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Z tytułem:</p>
                <code className="bg-muted px-2 py-1 rounded text-sm block">{emailSubject}</code>
              </div>
            </div>

            <Separator />
            
            <div className="flex justify-between gap-2">
              <DialogClose asChild>
                <Button variant="outline">Anuluj</Button>
              </DialogClose>
              <Button onClick={openMailClient} className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Otwórz program pocztowy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
