
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types";

interface ClientNotesProps {
  client: Client;
}

const ClientNotes = ({ client }: ClientNotesProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Notatki</CardTitle>
      </CardHeader>
      <CardContent>
        {client.notes ? (
          <p>{client.notes}</p>
        ) : (
          <p className="text-muted-foreground">Brak notatek dla tego klienta.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientNotes;
