
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/types";

interface ClientContactInfoProps {
  client: Client;
}

const ClientContactInfo = ({ client }: ClientContactInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dane kontaktowe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{client.email}</span>
        </div>
        {client.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
        )}
        {client.address && (
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
            <div>
              <p>{client.address}</p>
              {client.city && client.postCode && (
                <p>{client.postCode} {client.city}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Klient od: {new Date(client.createdAt).toLocaleDateString('pl-PL')}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClientContactInfo;
