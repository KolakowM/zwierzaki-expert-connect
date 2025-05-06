
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  type Feature = {
    id: string;
    content: ReactNode;
  };

  type PricingTier = {
    name: string;
    monthlyPrice: string;
    yearlyPrice: string;
    description: string;
    features: Feature[];
    cta: string;
    popular: boolean;
  };

  const tiers: PricingTier[] = [
    {
      name: "Testowy",
      monthlyPrice: "0 zł",
      yearlyPrice: "0 zł",
      description: "Wersja do testowania podstawowej funkcjonalności CRM",
      features: [
        { id: "t1", content: "Status: Niezweryfikowany" },
        { id: "t2", content: <strong>Brak widoczności w katalogu specjalistów</strong> },
        { id: "t3", content: "Do 5 klientów" },
        { id: "t4", content: "Do 10 zwierząt" },
        { id: "t5", content: "1 specjalizacja / 3 usługi" },
        { id: "t6", content: "Podstawowy profil specjalisty" },
        { id: "t7", content: "Możliwość rozbudowy limitu CRM (+20 zł/mies za dodatkowe 10 klientów/10 zwierząt)" }
        { id: "p8", content: },
        { id: "p9", content: },
        { id: "p10", content:  }
      ],
      cta: "Rozpocznij za darmo",
      popular: false
    },
    {
      name: "Zaawansowany",
      monthlyPrice: "29 zł",
      yearlyPrice: "490 zł",
      description: "Idealny dla rozwijających się praktyk",
      features: [
        { id: "a1", content: "Status: Zweryfikowany (po pierwszym zakupie)" },
        { id: "a2", content: <strong>Standardowa widoczność w katalogu specjalistów</strong> },
        { id: "a3", content: "Do 25 klientów" },
        { id: "a4", content: "Do 40 zwierząt" },
        { id: "a5", content: "Do 3 specjalizacji / 6 usług" },
        { id: "a6", content: "Pełny profil specjalisty" },
        { id: "a7", content: <strong>Jednorazowy rabat 10 zł/mies lub 100 zł/rok przy pierwszym zakupie</strong> },
        { id: "a8", content: "Możliwość rozbudowy limitu CRM (+20 zł/mies za dodatkowe 10 klientów/10 zwierząt)" },
        { id: "p9", content: },
        { id: "p10", content:  }
      ],
      cta: "Wybierz plan Zaawansowany",
      popular: true
    },
    {
      name: "Zawodowiec",
      monthlyPrice: "49 zł",
      yearlyPrice: "990 zł",
      description: "Dla profesjonalnych praktyk",
      features: [
        { id: "p1", content: "Status: Zweryfikowany (po pierwszym zakupie)" },
        { id: "p2", content: <strong>Wyróżniona widoczność w katalogu specjalistów</strong> },
        { id: "p3", content: "Do 50 klientów" },
        { id: "p4", content: "Do 75 zwierząt" },
        { id: "p5", content: "Wszystkie specjalizacje / 15 usług" },
        { id: "p6", content: "Priorytetowy profil specjalisty" },
        { id: "p7", content: <strong>Jednorazowy rabat 10 zł/mies lub 100 zł/rok przy pierwszym zakupie</strong> },
        { id: "p8", content: "Możliwość rozbudowy limitu CRM (+20 zł/mies za dodatkowe 10 klientów/10 zwierząt)" },
        { id: "p9", content: },
        { id: "p10", content:  }
      ],
      cta: "Wybierz plan Zawodowiec",
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
            
            <div className="mt-6 inline-flex items-center rounded-lg border p-1">
              <Button
                variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
                onClick={() => setBillingPeriod('monthly')}
                className="relative z-10"
              >
                Miesięcznie
              </Button>
              <Button
                variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
                onClick={() => setBillingPeriod('yearly')}
                className="relative z-10"
              >
                Rocznie (~25% rabatu)
              </Button>
            </div>
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
                    <span className="text-3xl font-bold">
                      {billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {billingPeriod === 'monthly' ? '/ miesiąc' : '/ rok'}
                    </span>
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
                <h3 className="text-lg font-medium">Czym różnią się poszczególne plany?</h3>
                <p className="text-muted-foreground">
                  Plany różnią się przede wszystkim limitami CRM (klienci/zwierzęta), liczbą dostępnych specjalizacji/usług oraz widocznością w katalogu specjalistów. Plan Testowy nie daje widoczności w katalogu, Zaawansowany oferuje standardową widoczność, a Zawodowiec - wyróżnioną.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Jak działa status weryfikacji?</h3>
                <p className="text-muted-foreground">
                  Status "Zweryfikowany" otrzymujesz automatycznie po pierwszym zakupie planu płatnego (Zaawansowany lub Zawodowiec). Ten status jest warunkiem koniecznym do widoczności Twojego profilu w katalogu specjalistów.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Co się dzieje, gdy przestanę płacić za subskrypcję?</h3>
                <p className="text-muted-foreground">
                  Po zakończeniu opłaconego okresu, Twoje konto zostanie zdegradowane do planu Testowego. Zachowasz dostęp tylko do 5 najnowszych klientów i 10 najnowszych zwierząt, a Twój profil przestanie być widoczny w katalogu specjalistów.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Czy mogę rozszerzyć limit klientów i zwierząt?</h3>
                <p className="text-muted-foreground">
                  Tak, oferujemy dodatek (+20 zł miesięcznie), który zwiększa limit o dodatkowych 10 klientów i 10 zwierząt. Możesz dokupić tyle dodatków, ile potrzebujesz.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Na czym polega rabat dla nowych użytkowników?</h3>
                <p className="text-muted-foreground">
                  Przy pierwszym zakupie planu płatnego otrzymujesz jednorazowy rabat w wysokości 10 zł przy płatności miesięcznej lub 100 zł przy płatności rocznej. Rabat obowiązuje tylko przy pierwszym zakupie danego planu.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Czy mogę zmienić plan w dowolnym momencie?</h3>
                <p className="text-muted-foreground">
                  Tak, możesz zmienić plan w każdej chwili. Jeśli przejdziesz na plan wyższy, różnica zostanie obliczona proporcjonalnie. Jeśli przejdziesz na plan niższy, zmiana nastąpi po zakończeniu bieżącego okresu rozliczeniowego.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Jakie formy płatności akceptujecie?</h3>
                <p className="text-muted-foreground">
                  Akceptujemy płatności kartami kredytowymi, Blik, przelewem bankowym oraz poprzez popularne bramki płatności.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
