
import { Edit } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <CardFooter>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edytuj notatki
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientNotes;
