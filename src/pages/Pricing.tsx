
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

export default function Pricing() {
  // Explicitly define the feature type to handle both strings and JSX elements
  type Feature = {
    id: string;
    content: ReactNode;
  };

  type PricingTier = {
    name: string;
    price: string;
    description: string;
    features: Feature[];
    cta: string;
    popular: boolean;
  };

  const tiers: PricingTier[] = [
    {
      name: "Testowy",
      price: "0 zł",
      description: "Dla rozpoczynających działalność",
      features: [
        { id: "t1", content: "Miejsce w katalogu specjalistów" },
        { id: "t2", content: "Możliwość wskazania 1 specjalizacji zawodowych " },
        { id: "t3", content: <del>"Podstawowy profil"</del> },
        { id: "t4", content: "Do 5 klientów" },
        { id: "t5", content: "Do 10 zwierząt" },
        { id: "t6", content: "Pomoc mailowa" },
        { id: "t7", content: <del>"Kalendarz podstawowy"</del> }
      ],
      cta: "Rozpocznij za darmo",
      popular: false
    },
    {
      name: "Zaawansowany",
      price: "29 zł / miesiąc",
      description: "Dla rozwijających się praktyk",
      features: [
        { id: "a1", content: "Miejsce w katalogu specjalistów" },
        { id: "a2", content: "Możliwość wskazania 3 specjalizacji zawodowych " },
        { id: "a3", content: "Do 15 klientów" },
        { id: "a4", content: "Do 30 zwierząt" },
        { id: "a5", content: "Piorytetowa pomoc" },
        { id: "a6", content: <del>"Dokumenty i załączniki"</del> },
        { id: "a7", content: <del>"Automatyczne powiadomienia"</del> },
        { id: "a8", content: <del>"Historia leczenia"</del> },
        { id: "a9", content: <del>"Eksport danych"</del> }
      ],
      cta: "Wybierz plan",
      popular: true
    },
    {
      name: "Zawodowiec",
      price: "49 zł / miesiąc",
      description: "Dla większych praktyków pracy z zwierzętami",
      features: [
        { id: "p1", content: "Miejsce w katalogu specjalistów" },
        { id: "p2", content: "Możliwość wskazania 5 specjalizacji zawodowych " },
        { id: "p3", content: "Nieograniczeni klienci" },
        { id: "p4", content: "Nieograniczona liczba zwierząt" },
        { id: "p5", content: <del>"Analityka i raporty"</del> },
        { id: "p6", content: <del>"Płatności online"</del> },
        { id: "p7", content: <del>"Integracja z zewnętrznymi systemami"</del> },
        { id: "p8", content: <del>"Dedykowane wsparcie"</del> }
      ],
      cta: "Wybierz plan",
      popular: false
    }
  ];

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="text-center">
            <div className="flex justify-center">
              <ReceiptText className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Przejrzyste ceny</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Wybierz plan odpowiedni dla Twojej praktyki
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <Card key={tier.name} className={tier.popular ? "border-primary shadow-lg" : ""}>
                {tier.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Polecany
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{tier.price}</span>
                  </div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature.id} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature.content}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/register" className="w-full">
                    <Button 
                      className="w-full" 
                      variant={tier.popular ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 space-y-6 rounded-lg border bg-background p-8">
            <h2 className="text-2xl font-bold">Często zadawane pytania o cennik</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Czy mogę zmienić plan w dowolnym momencie?</h3>
                <p className="text-muted-foreground">Tak, możesz zmienić lub anulować plan w dowolnym momencie.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Czy jest dostępny okres próbny?</h3>
                <p className="text-muted-foreground">Tak, oferujemy 14-dniowy okres próbny na planach Profesjonalny i Klinika.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Jakie formy płatności akceptujecie?</h3>
                <p className="text-muted-foreground">Akceptujemy karty płatnicze, przelewy bankowe oraz BLIK.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
