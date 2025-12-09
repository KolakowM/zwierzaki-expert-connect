import { ShieldCheck, Ban, Heart, Users, Sparkles } from "lucide-react";

const trustPoints = [
  {
    icon: Ban,
    title: "Brak spamu",
    description: "Nie wysyłamy niechcianych wiadomości. Szanujemy Twoją skrzynkę.",
  },
  {
    icon: ShieldCheck,
    title: "0% prowizji",
    description: "Nie pobieramy żadnej prowizji od Twoich usług. Zarabiasz 100%.",
  },
  {
    icon: Heart,
    title: "Cennik opcjonalny",
    description: "Możesz, ale nie musisz publikować swoich cen. To Twój wybór.",
  },
  {
    icon: Users,
    title: "Każda specjalizacja",
    description: "Weterynarze, behawioryści, fizjoterapeuci, groomerzy i inni. Wszyscy są mile widziani.",
  },
  {
    icon: Sparkles,
    title: "Ciągle się rozwijamy",
    description: "PetsFlow nie jest idealny, ale słuchamy użytkowników i stale ulepszamy platformę.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Chcemy być domyślnym wyborem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dla wszystkich profesjonalistów pracujących ze zwierzętami. 
            Bez względu na specjalizację.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {trustPoints.map((point, index) => (
            <div key={index} className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <point.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
