
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { Client } from "@/types";

interface ClientDocumentsTabProps {
  client: Client;
}

const ClientDocumentsTab = ({ client }: ClientDocumentsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Dokumenty i plany opieki</CardTitle>
          <CardDescription>
            Dokumenty i plany opieki przypisane do tego klienta
          </CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Dodaj dokument
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-2 text-lg font-medium">Brak dokumentów</h3>
          <p className="text-muted-foreground mt-1">
            Ten klient nie ma jeszcze żadnych dokumentów ani planów opieki
          </p>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Utwórz nowy plan opieki
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDocumentsTab;
