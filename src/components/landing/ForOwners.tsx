import { Shield, FileSearch, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const features = [
  {
    icon: Shield,
    title: "Zweryfikowani specjaliści",
    description:
      "Każdy specjalista na PetsFlow przechodzi proces weryfikacji kompetencji i doświadczenia. Masz pewność, że dokumentacja Twojego zwierzęcia jest w dobrych rękach.",
  },
  {
    icon: FileSearch,
    title: "Uporządkowana historia leczenia",
    description:
      "PetsFlow porządkuje dane tak, aby specjalista mógł szybko sprawdzić wcześniejsze wizyty, diagnozy i zalecenia. To mniejsza szansa na pomyłki.",
  },
  {
    icon: Share2,
    title: "Poleć swojemu specjaliście",
    description:
      "Jeśli Twój ulubiony opiekun lub behawiorysta nie korzysta jeszcze z PetsFlow – wyślij mu link. Razem budujemy lepszą opiekę nad zwierzętami.",
  },
];

export default function ForOwners() {
  const copyLink = () => {
    navigator.clipboard.writeText("https://petsflow.pl/start");
    toast.success("Link skopiowany do schowka!");
  };

  return (
    <section id="for-owners" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Dla właścicieli zwierząt
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Wybieraj specjalistów, którzy traktują dokumentację poważnie
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            PetsFlow pomaga specjalistom prowadzić uporządkowaną, cyfrową kartotekę pacjentów. Ty możesz świadomie
            wybierać tych, którzy dbają o przejrzystą historię leczenia Twojego pupila.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-background rounded-2xl p-8 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Zapytaj swojego specjalistę</h3>
          <p className="text-muted-foreground mb-6">
            Czy Twój dietetyk, behawiorysta lub groomer prowadzi cyfrową dokumentację? Jeśli nie korzysta jeszcze z
            PetsFlow, wyślij mu ten link.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={copyLink} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Skopiuj link do strony
            </Button>
            <Button asChild>
              <Link to="/catalog">
                <ExternalLink className="mr-2 h-4 w-4" />
                Przeglądaj katalog specjalistów
              </Link>
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Mamy już wielu zapytań o polecanych specjalistów.
            <br className="hidden sm:block" />
            Pomagamy łączyć właścicieli z najlepszymi ekspertami w ich okolicy.
          </p>
        </div>
      </div>
    </section>
  );
}
