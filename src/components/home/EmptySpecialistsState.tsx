
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, ArrowRight, UserPlus } from "lucide-react";

export function EmptySpecialistsState() {
  return (
    <div className="py-12">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Specjaliści wkrótce dostępni
            </h3>
            <p className="text-muted-foreground mb-6">
              Pracujemy nad poszerzeniem naszej bazy specjalistów. 
              Już wkrótce znajdziesz tutaj najlepszych ekspertów ds. zwierząt.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/catalog">
              <Button variant="default" className="w-full sm:w-auto">
                Przeglądaj katalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/become-specialist">
              <Button variant="outline" className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Zostań specjalistą
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
