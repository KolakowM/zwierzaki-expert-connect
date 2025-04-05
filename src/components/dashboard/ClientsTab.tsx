
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import ResponsiveClientForm from "@/components/clients/ResponsiveClientForm";

const ClientsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Baza klientów</CardTitle>
        <CardDescription>
          Zarządzaj swoimi klientami
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center p-4">
        <Users className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Przejdź do bazy klientów</p>
        <p className="text-sm text-muted-foreground mb-4">Przeglądaj, dodawaj i zarządzaj klientami oraz ich zwierzętami</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button asChild>
            <Link to="/clients">
              <Users className="mr-2 h-4 w-4" />
              Zarządzaj klientami
            </Link>
          </Button>
          <ResponsiveClientForm 
            buttonText="Dodaj klienta" 
            buttonVariant="outline"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsTab;
