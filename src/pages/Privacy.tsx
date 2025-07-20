import MainLayout from "@/components/layout/MainLayout";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Polityka Prywatności</h1>
          </div>

          <p className="text-muted-foreground">Ostatnia aktualizacja: 05.04.2025</p>
          
          <div className="space-y-8 pt-4">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Wstęp</h2>
              <p>
                Niniejsza Polityka Prywatności ma na celu poinformowanie użytkowników platformy PetsFlow 
                o tym, jakie dane osobowe gromadzimy, w jaki sposób je wykorzystujemy, przechowujemy i chronimy.
                Korzystając z naszych usług, użytkownik akceptuje praktyki opisane w niniejszej Polityce Prywatności.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Administrator danych osobowych</h2>
              <p>
                Administratorem danych osobowych jest właścicel PetsFlow {/*Sp. z o.o. z siedzibą w Warszawie,
                ul. Zwierzęca 123, 00-001 Warszawa, wpisana do rejestru przedsiębiorców Krajowego Rejestru
                Sądowego pod numerem KRS: 0000000000, NIP: 0000000000, REGON: 000000000.*/}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">3. Jakie dane gromadzimy</h2>
              <p>
                W zależności od wykorzystywanych funkcji platformy, możemy zbierać następujące dane:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dane identyfikacyjne: imię, nazwisko, adres e-mail</li>
                <li>Dane kontaktowe: numer telefonu, adres</li>
                <li>Dane profilowe: informacje o specjalizacji, wykształceniu, doświadczeniu zawodowym</li>
                <li>Dane klientów i pacjentów: informacje o klientach i ich zwierzętach</li>
                <li>Dane dotyczące wizyt i usług: harmonogramy, diagnozy, zalecenia</li>
                <li>Dane techniczne: adres IP, dane o urządzeniu, logi systemowe</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Cele przetwarzania danych</h2>
              <p>
                Przetwarzamy dane osobowe w następujących celach:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Świadczenie usług w ramach platformy PetsFlow</li>
                <li>Zarządzanie kontem użytkownika</li>
                <li>Poprawa jakości naszych usług</li>
                <li>Komunikacja z użytkownikami</li>
                <li>Realizacja płatności</li>
                <li>Wywiązywanie się z zobowiązań prawnych</li>
                <li>Marketing własnych produktów i usług (za zgodą użytkownika)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Podstawy prawne przetwarzania danych</h2>
              <p>
                Podstawą prawną przetwarzania danych osobowych jest:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Wykonanie umowy (Art. 6 ust. 1 lit. b RODO)</li>
                <li>Obowiązek prawny ciążący na administratorze (Art. 6 ust. 1 lit. c RODO)</li>
                <li>Prawnie uzasadniony interes administratora (Art. 6 ust. 1 lit. f RODO)</li>
                <li>Zgoda osoby, której dane dotyczą (Art. 6 ust. 1 lit. a RODO)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Okres przechowywania danych</h2>
              <p>
                Dane osobowe będą przechowywane przez okres niezbędny do realizacji celów, dla których zostały zebrane, 
                a po tym czasie przez okres wymagany przepisami prawa lub do czasu przedawnienia ewentualnych roszczeń.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">7. Udostępnianie danych</h2>
              <p>
                Dane osobowe mogą być udostępniane:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Podmiotom przetwarzającym dane na zlecenie administratora</li>
                <li>Dostawcom usług IT i hostingowych</li>
                <li>Dostawcom systemów płatności online</li>
                <li>Organom państwowym, gdy wynika to z obowiązku prawnego</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">8. Prawa użytkowników</h2>
              <p>
                Każdy użytkownik ma prawo do:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dostępu do swoich danych</li>
                <li>Sprostowania danych</li>
                <li>Usunięcia danych</li>
                <li>Ograniczenia przetwarzania</li>
                <li>Przenoszenia danych</li>
                <li>Sprzeciwu wobec przetwarzania</li>
                <li>Wycofania zgody</li>
                <li>Wniesienia skargi do organu nadzorczego</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">9. Bezpieczeństwo danych</h2>
              <p>
                Stosujemy odpowiednie środki techniczne i organizacyjne, aby zapewnić bezpieczeństwo danych osobowych, 
                w tym szyfrowanie danych, regularne aktualizacje systemów bezpieczeństwa oraz ograniczony dostęp do danych.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">10. Kontakt</h2>
              <p>
                W sprawach związanych z ochroną danych osobowych można kontaktować się z nami pod adresem email: 
                prywatnosc@expertzwierzaki.pl lub listownie na adres siedziby firmy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
