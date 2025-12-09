import { 
  Users, 
  Calendar, 
  Heart, 
  FileText, 
  UserCircle, 
  Search,
  Bell,
  Mail,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const currentFeatures = [
  {
    icon: Users,
    title: "Baza klientów",
    description: "Zarządzaj danymi kontaktowymi właścicieli zwierząt w jednym miejscu",
  },
  {
    icon: Heart,
    title: "Kartoteka pacjentów",
    description: "Pełna historia medyczna, alergie, dieta i notatki behawioralne",
  },
  {
    icon: Calendar,
    title: "Historia wizyt",
    description: "Szczegółowe zapisy wizyt z zaleceniami i statusami follow-up",
  },
  {
    icon: Sparkles,
    title: "Programy opieki",
    description: "Twórz indywidualne programy rehabilitacji i pielęgnacji",
  },
  {
    icon: FileText,
    title: "Notatki z załącznikami",
    description: "Dodawaj zdjęcia, dokumenty i pliki do notatek pacjentów",
  },
  {
    icon: UserCircle,
    title: "Profil w katalogu",
    description: "Twój weryfikowany profil widoczny dla właścicieli zwierząt",
  },
];

const plannedFeatures = [
  {
    icon: Bell,
    title: "Automatyczne przypomnienia",
    description: "SMS i email dla klientów przed wizytą",
  },
  {
    icon: Mail,
    title: "Wysyłanie zaleceń",
    description: "Wyślij zalecenia bezpośrednio do klienta",
  },
  {
    icon: MessageSquare,
    title: "Bezpośredni kontakt",
    description: "Czat między specjalistą a właścicielem",
  },
];

const advantages = [
  "0% prowizji od Twoich usług",
  "Brak dodatkowej konfiguracji – wszystko gotowe od startu",
  "Niższe koszty niż konkurencja przy rozbudowanym systemie",
  "Każda specjalizacja mile widziana",
  "Cennik opcjonalny – nie musi być publiczny",
];

export default function ForSpecialists() {
  return (
    <section id="for-specialists" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Dla specjalistów</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Twoje dedykowane narzędzie pracy
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            PetsFlow to nie kolejny arkusz kalkulacyjny. To system stworzony specjalnie 
            dla profesjonalistów pracujących ze zwierzętami – weterynarzy, behawiorystów, 
            fizjoterapeutów, groomerów i wielu innych.
          </p>
        </div>

        {/* Current Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {currentFeatures.map((feature, index) => (
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

        {/* Planned Features */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-2">🔜 Planowane funkcje</Badge>
            <h3 className="text-xl font-semibold text-foreground">
              Nad czym pracujemy?
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plannedFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground text-center mb-6">
            Dlaczego warto?
          </h3>
          <ul className="space-y-3">
            {advantages.map((advantage, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                <span className="text-muted-foreground">{advantage}</span>
              </li>
            ))}
          </ul>
          
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link to="/register">Załóż darmowe konto</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
