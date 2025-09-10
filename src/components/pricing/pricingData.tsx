
import { ReactNode } from "react";
import { PricingFeature } from "./PricingCard";
import { useTranslation } from "react-i18next";

export interface PricingTier {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  popular: boolean;
  lowestPrice30Days?: string;
}

export const usePricingTiers = () => {
  const { t } = useTranslation();
  
  const pricingTiers: PricingTier[] = [
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
        { id: "t5", content: "1 specjalizacja i 3 usługi" },
        //{ id: "t6", content: "Podstawowy profil specjalisty" },
       // { id: "t7", content: "Możliwość rozbudowy limitu CRM (+15 zł/mies za dodatkowe 10 klientów i 10 zwierząt) - dostępne wkrótce" }
      ],
      cta: t('pricing.start_free'),
      popular: false,
      lowestPrice30Days: "Najniższa cena z ostatnich 30 dni: 0 zł"
    },
    {
      name: "Zaawansowany",
      monthlyPrice: "49 zł",
      yearlyPrice: "490 zł",
      description: "Idealny dla rozwijających się praktyk",
      features: [
        { id: "a1", content: "Status: Zweryfikowany (po pierwszym zakupie)" },
        { id: "a2", content: <strong>Standardowa widoczność w katalogu specjalistów</strong> },
        { id: "a3", content: "Do 25 klientów" },
        { id: "a4", content: "Do 40 zwierząt" },
        { id: "a5", content: "Do 3 specjalizacji i 6 usług" },
        //{ id: "a6", content: "Pełny profil specjalisty" },
        { id: "a7", content: <strong>Jednorazowy rabat 10% przy pierwszym zakupie dowolnego pakietu</strong> },
        //{ id: "a8", content: "Możliwość rozbudowy limitu CRM (+15 zł/mies za dodatkowe 10 klientów i 10 zwierząt) - dostępne wkrótce" }
      ],
      cta: `${t('pricing.choose_plan')} Zaawansowany`,
      popular: true,
      lowestPrice30Days: "Najniższa cena z ostatnich 30 dni: 49 zł/mies (490 zł/rok)"
    },
    {
      name: "Zawodowiec",
      monthlyPrice: "99 zł",
      yearlyPrice: "990 zł",
      description: "Dla profesjonalnych praktyk",
      features: [
        { id: "p1", content: "Status: Zweryfikowany (po pierwszym zakupie)" },
        { id: "p2", content: <strong>Wyróżniona widoczność w katalogu specjalistów</strong> },
        { id: "p3", content: "Do 50 klientów" },
        { id: "p4", content: "Do 75 zwierząt" },
        { id: "p5", content: "Wszystkie specjalizacje i 15 usług" },
        //{ id: "p6", content: "Wyróżniony profil specjalisty" },
        { id: "p7", content: "Pierwszeństwo w dostępie do nowych funkcji" },
        { id: "p8", content: <strong>Jednorazowy rabat 10% przy pierwszym zakupie dowolnego pakietu</strong> },
      //{ id: "p9", content: "Możliwość rozbudowy limitu CRM (+15 zł/mies za dodatkowe 10 klientów i 10 zwierząt) - dostępne wkrótce" }
      ],
      cta: `${t('pricing.choose_plan')} Zawodowiec`,
      popular: false,
      lowestPrice30Days: "Najniższa cena z ostatnich 30 dni: 99 zł/mies (990 zł/rok)"
    }
  ];
  
  return pricingTiers;
};
