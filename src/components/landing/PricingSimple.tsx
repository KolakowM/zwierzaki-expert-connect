import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Testowy",
    price: "0",
    description: "Na start, bez zobowiązań",
    features: [
      "Do 5 klientów",
      "Do 10 zwierząt",
      "1 specjalizacja",
      "Historia wizyt",
    ],
    highlighted: false,
  },
  {
    name: "Zaawansowany",
    price: "9,99",
    description: "Dla rozwijających się praktyk",
    features: [
      "Do 30 klientów",
      "Do 60 zwierząt",
      "3 specjalizacje",
      "Profil w katalogu",
      "Notatki z załącznikami",
    ],
    highlighted: true,
  },
  {
    name: "Zawodowiec",
    price: "19,99",
    description: "Pełne możliwości",
    features: [
      "Do 100 klientów",
      "Do 200 zwierząt",
      "10 specjalizacji",
      "Profil w katalogu",
      "Wyróżnienie w karuzeli",
      "Programy opieki",
    ],
    highlighted: false,
  },
];

export default function PricingSimple() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Proste i przejrzyste ceny
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bez ukrytych opłat, bez prowizji od Twoich usług. 
            Zacznij za darmo i rozwijaj się w swoim tempie.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={cn(
                "relative",
                plan.highlighted && "border-primary shadow-lg scale-105"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Polecany
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground"> zł/mies.</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/pricing">Zobacz pełny cennik</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
