
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function PricingFAQ() {
  return (
    <div className="mt-12 space-y-6 rounded-lg border bg-background p-8">
      <h2 className="text-2xl font-bold">Często zadawane pytania o cennik</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="faq-1">
          <AccordionTrigger>Czym różnią się poszczególne plany?</AccordionTrigger>
          <AccordionContent>
            Plany różnią się przede wszystkim limitami CRM (klienci/zwierząt), liczbą dostępnych specjalizacji/usług oraz widocznością w katalogu specjalistów. Plan Testowy nie daje widoczności w katalogu, Zaawansowany oferuje standardową widoczność, a Zawodowiec - wyróżnioną.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-2">
          <AccordionTrigger>Jak działa status weryfikacji?</AccordionTrigger>
          <AccordionContent>
            Status "Zweryfikowany" otrzymujesz automatycznie po pierwszym zakupie planu płatnego (Zaawansowany lub Zawodowiec). Ten status jest warunkiem koniecznym do widoczności Twojego profilu w katalogu specjalistów.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-3">
          <AccordionTrigger>Co się dzieje, gdy przestanę płacić za subskrypcję?</AccordionTrigger>
          <AccordionContent>
            Po zakończeniu opłaconego okresu, Twoje konto zostanie zdegradowane do planu Testowego. Zachowasz dostęp tylko do 5 najnowszych klientów i 10 najnowszych zwierząt, a Twój profil przestanie być widoczny w katalogu specjalistów.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-4">
          <AccordionTrigger>Czy mogę rozszerzyć limit klientów i zwierząt?</AccordionTrigger>
          <AccordionContent>
            Tak, oferujemy dodatek, który zwiększa limit o dodatkowych 10 klientów i 10 zwierząt. W celu skorzystania prosze o wiadomość na adres: kontakt@petsflow.pl.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-5">
          <AccordionTrigger>Na czym polega rabat dla nowych użytkowników?</AccordionTrigger>
          <AccordionContent>
            Przy pierwszym zakupie planu płatnego otrzymujesz jednorazowy rabat w wysokości 15% przy płatności miesięcznej lub rocznej. Rabat obowiązuje tylko przy pierwszym zakupie danego planu.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-6">
          <AccordionTrigger>Czy mogę zmienić plan w dowolnym momencie?</AccordionTrigger>
          <AccordionContent>
            Tak, możesz zmienić plan w każdej chwili. Jeśli przejdziesz na plan wyższy, różnica zostanie obliczona proporcjonalnie. Jeśli przejdziesz na plan niższy, zmiana nastąpi po zakończeniu bieżącego okresu rozliczeniowego.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq-7">
          <AccordionTrigger>Jakie formy płatności akceptujecie?</AccordionTrigger>
          <AccordionContent>
            Akceptujemy płatności kartami kredytowymi, Blik, przelewem bankowym oraz poprzez popularne bramki płatności.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
