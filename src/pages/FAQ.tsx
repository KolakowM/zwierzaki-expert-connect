
import MainLayout from "@/components/layout/MainLayout";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqItems = [
    {
      question: "Czym jest PetsFlow?",
      answer: "PetsFlow to platforma zaprojektowana specjalnie dla specjalistów zajmujących się opieką nad zwierzętami, takich jak weterynarze, behawioryści, groomerzy i inni. Platforma umożliwia zarządzanie klientami, pacjentami, terminarzem wizyt oraz dokumentacją medyczną w jednym miejscu."
    },
    {
      question: "Czy mogę korzystać z PetsFlow na urządzeniach mobilnych?",
      answer: "Tak, platforma PetsFlow jest w pełni responsywna i dostępna na wszystkich urządzeniach z dostępem do internetu - komputerach, tabletach i smartfonach. Możesz zarządzać swoją praktyką z dowolnego miejsca i w dowolnym czasie."
    },
    {
      question: "Jak wygląda proces rejestracji?",
      answer: "Rejestracja jest prosta i szybka. Wystarczy wypełnić formularz rejestracyjny podając podstawowe dane, a następnie uzupełnić profil specjalisty. Po weryfikacji danych, Twój profil będzie widoczny w katalogu specjalistów."
    },
    {
      question: "Czy mogę wypróbować platformę przed zakupem?",
      answer: "Tak, oferujemy darmowe konto podstawowe z ograniczonymi funkcjami oraz 14-dniowy okres próbny na plany płatne. W ten sposób możesz przetestować platformę przed podjęciem decyzji o zakupie."
    },
    {
      question: "Jak działa katalog specjalistów?",
      answer: "Katalog specjalistów to miejsce, gdzie potencjalni klienci mogą znaleźć specjalistów w swojej okolicy. Twój profil zawierający opis usług, lokalizację i dane kontaktowe będzie widoczny dla osób poszukujących pomocy dla swoich zwierząt."
    },
    {
      question: "Czy moje dane są bezpieczne?",
      answer: "Bezpieczeństwo danych jest naszym priorytetem. Stosujemy najnowsze technologie szyfrowania danych, regularne kopie zapasowe oraz zgodność z przepisami RODO. Wszystkie dane klientów i pacjentów są przechowywane z zachowaniem najwyższych standardów bezpieczeństwa."
    },
    {
      question: "Czy mogę importować istniejące dane klientów?",
      answer: "Tak, oferujemy możliwość importu danych do naszej bazy. W tym celu należy się z nami skontaktować aby omówić szczegóły."
    },
    {
      question: "Jak mogę anulować subskrypcję?",
      answer: "Subskrypcję można anulować w dowolnym momencie z poziomu panelu ustawień konta. Po anulowaniu, możesz korzystać z platformy do końca opłaconego okresu. Nie stosujemy ukrytych opłat ani kar za wcześniejsze zrezygnowanie z usługi."
    },
    {
      question: "Jakie wsparcie oferujecie użytkownikom?",
      answer: "Oferujemy wsparcie techniczne poprzez email w godzinach pracy. Dodatkowo, na naszej stronie znajduje się baza wiedzy z poradnikami i instrukcjami obsługi platformy."
    }
  ];

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="text-center">
            <div className="flex justify-center">
              <HelpCircle className="h-10 w-10 text-primary" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Często Zadawane Pytania
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące platformy PetsFlow.
            </p>
          </header>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger 
                  className="text-left text-lg font-medium"
                  aria-expanded="false"
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </MainLayout>
  );
}
