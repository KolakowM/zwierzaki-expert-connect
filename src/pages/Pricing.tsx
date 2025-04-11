
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing() {
  const tiers = [
    {
      name: "Testowy",
      price: "0 zł",
      description: "Dla rozpoczynających działalność",
      features: [
        "Miejsce w katalogu specjalistów",
        <del>"Podstawowy profil"</del>,
        "Do 5 klientów",
        "Do 10 zwierząt",
        "Pomoc mailowa",
        <del>"Kalendarz podstawowy"</del>
      ],
      cta: "Rozpocznij za darmo",
      popular: false
    },
    {
      name: "Zaawansowany",
      price: "29 zł / miesiąc",
      description: "Dla rozwijających się praktyk",
      features: [
        "Miejsce w katalogu specjalistów",
        "Do 15 klientów",
        "Do 30 zwierząt",
        "Piorytetowa pomoc",
        <del>"Dokumenty i załączniki",
        "Automatyczne powiadomienia",
        "Historia leczenia",
        "Eksport danych"</del>
      ],
      cta: "Wybierz plan",
      popular: true
    },
    {
      name: "Zawodowiec",
      price: "99 zł / miesiąc",
      description: "Dla większych praktyków pracy z zwierzętami",
      features: [
        "Specjalnie miejsce w katalogu specjalistów",
        "Nieograniczeni klienci",
        "Nieograniczona liczba zwierząt",
        <del>"Analityka i raporty",
        "Płatności online",
        "Integracja z zewnętrznymi systemami",
        "Dedykowane wsparcie"</del>
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
                      <li key={feature} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature}</span>
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
