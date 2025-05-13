
import { ReactNode } from "react";
import { PricingFeature } from "./PricingCard";

export interface PricingTier {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  popular: boolean;
}

export const pricingTiers: PricingTier[] = [
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
      { id: "a8", content: "Możliwość rozbudowy limitu CRM (+20 zł/mies za dodatkowe 10 klientów/10 zwierząt)" }
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
      { id: "p8", content: "Możliwość rozbudowy limitu CRM (+20 zł/mies za dodatkowe 10 klientów/10 zwierząt)" }
    ],
    cta: "Wybierz plan Zawodowiec",
    popular: false
  }
];
