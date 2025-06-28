
import MainLayout from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Regulamin Serwisu PetsFlow</h1>
          </div>

          <p className="text-muted-foreground">Ostatnia aktualizacja: 28 czerwca 2025</p>
          
          <div className="space-y-8 pt-4">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§1. Postanowienia ogólne</h2>
              <p>
                1. Niniejszy regulamin określa zasady świadczenia usług drogą elektroniczną w ramach 
                serwisu internetowego PetsFlow, dostępnego pod adresem www.petsflow.pl oraz aplikacji mobilnej PetsFlow.
              </p>
              <p>
                2. Właścicielem i operatorem serwisu PetsFlow jest PetsFlow Sp. z o.o. 
                z siedzibą w Warszawie, ul. Główna 123, 00-001 Warszawa, wpisana do rejestru 
                przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS: 0000123456, 
                NIP: 1234567890, REGON: 123456789, kapitał zakładowy: 50.000 zł.
              </p>
              <p>
                3. Kontakt z Usługodawcą: email: kontakt@petsflow.pl, tel: +48 22 123 45 67.
              </p>
              <p>
                4. Serwis działa 24 godziny na dobę, 7 dni w tygodniu, z zastrzeżeniem przerw technicznych.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§2. Definicje</h2>
              <p>Na potrzeby niniejszego regulaminu przyjmuje się następujące znaczenie pojęć:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Serwis</strong> – platforma internetowa PetsFlow dostępna pod adresem www.petsflow.pl oraz aplikacja mobilna;</li>
                <li><strong>Usługodawca</strong> – PetsFlow Sp. z o.o. z siedzibą w Warszawie;</li>
                <li><strong>Użytkownik</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, korzystająca z Serwisu;</li>
                <li><strong>Specjalista</strong> – Użytkownik świadczący usługi w zakresie opieki nad zwierzętami, posiadający odpowiednie kwalifikacje;</li>
                <li><strong>Klient</strong> – Użytkownik korzystający z usług Specjalisty za pośrednictwem Serwisu;</li>
                <li><strong>Właściciel zwierzęcia</strong> – osoba prawnie odpowiedzialna za zwierzę;</li>
                <li><strong>Konto</strong> – zbiór zasobów i uprawnień w ramach Serwisu przypisanych do konkretnego Użytkownika;</li>
                <li><strong>Pakiet</strong> – zestaw funkcjonalności dostępnych w ramach określonego planu subskrypcji;</li>
                <li><strong>Dane osobowe</strong> – informacje o zidentyfikowanej lub możliwej do zidentyfikowania osobie fizycznej;</li>
                <li><strong>RODO</strong> – Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r.</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§3. Warunki korzystania z Serwisu</h2>
              <p>
                1. Korzystanie z pełnej funkcjonalności Serwisu wymaga założenia Konta i akceptacji niniejszego Regulaminu.
              </p>
              <p>
                2. Aby założyć Konto, Użytkownik musi:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>ukończyć 18 lat lub działać za zgodą przedstawiciela ustawowego;</li>
                <li>posiadać pełną zdolność do czynności prawnych;</li>
                <li>podać prawdziwe i aktualne dane;</li>
                <li>zaakceptować niniejszy Regulamin i Politykę Prywatności.</li>
              </ul>
              <p>
                3. Zakazane jest:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>używanie Serwisu w sposób sprzeczny z prawem lub niniejszym Regulaminem;</li>
                <li>naruszanie praw innych Użytkowników;</li>
                <li>zamieszczanie treści obraźliwych, bezprawnych lub wprowadzających w błąd;</li>
                <li>próby nieautoryzowanego dostępu do systemów Serwisu;</li>
                <li>wykorzystywanie Serwisu do celów komercyjnych bez zgody Usługodawcy;</li>
                <li>tworzenie fałszywych kont lub podszywanie się pod inne osoby.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§4. Rejestracja i zarządzanie Kontem</h2>
              <p>
                1. Rejestracja w Serwisie jest bezpłatna i wymaga podania:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>imienia i nazwiska;</li>
                <li>adresu e-mail;</li>
                <li>hasła spełniającego wymagania bezpieczeństwa;</li>
                <li>dla Specjalistów: dodatkowych danych zawodowych i kwalifikacji.</li>
              </ul>
              <p>
                2. Użytkownik zobowiązuje się do:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>zachowania poufności danych logowania;</li>
                <li>niezwłocznego informowania o nieautoryzowanym użyciu Konta;</li>
                <li>aktualizowania danych w przypadku ich zmiany;</li>
                <li>wylogowywania się po zakończeniu korzystania z Serwisu na urządzeniach publicznych.</li>
              </ul>
              <p>
                3. Usługodawca może zawiesić lub usunąć Konto w przypadku naruszenia Regulaminu.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§5. Pakiety i opłaty</h2>
              <p>
                1. Serwis oferuje następujące pakiety:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Testowy (0 zł)</strong> – ograniczona funkcjonalność, brak widoczności w katalogu;</li>
                <li><strong>Zaawansowany (49 zł/mies lub 490 zł/rok)</strong> – rozszerzona funkcjonalność, standardowa widoczność;</li>
                <li><strong>Zawodowiec (99 zł/mies lub 990 zł/rok)</strong> – pełna funkcjonalność, wyróżniona widoczność.</li>
              </ul>
              <p>
                2. Ceny zawierają podatek VAT zgodnie z obowiązującymi przepisami.
              </p>
              <p>
                3. Płatności realizowane są przez Stripe Inc., zgodnie z międzynarodowymi standardami bezpieczeństwa.
              </p>
              <p>
                4. Faktury VAT wystawiane są automatycznie i przesyłane na adres e-mail Użytkownika.
              </p>
              <p>
                5. W przypadku opłat cyklicznych, środki pobierane są automatycznie w dniu odnowienia subskrypcji.
              </p>
              <p>
                6. Pierwsza płatność za pakiet płatny uprawnia do rabatu 10 zł/mies lub 100 zł/rok.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§6. Prawo odstąpienia i zwroty</h2>
              <p>
                1. Konsument ma prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny, zgodnie z art. 27 ustawy o prawach konsumenta.
              </p>
              <p>
                2. Prawo odstąpienia nie przysługuje w przypadku usług cyfrowych, z których Konsument rozpoczął korzystanie za wyrażoną zgodą.
              </p>
              <p>
                3. Zwrot środków następuje w terminie 14 dni od otrzymania oświadczenia o odstąpieniu.
              </p>
              <p>
                4. Zwroty realizowane są na ten sam rachunek, z którego została dokonana płatność.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§7. Specjaliści i weryfikacja</h2>
              <p>
                1. Specjalistami mogą zostać osoby posiadające odpowiednie kwalifikacje w zakresie:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>medycyny weterynaryjnej (licencja nr z Krajowej Izby Lekarsko-Weterynaryjnej);</li>
                <li>behawiorystyki zwierząt (certyfikaty uznanych organizacji);</li>
                <li>groomingu (dokumenty potwierdzające kwalifikacje);</li>
                <li>innych usług dla zwierząt (odpowiednie certyfikaty).</li>
              </ul>
              <p>
                2. Proces weryfikacji obejmuje:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>sprawdzenie dokumentów potwierdzających kwalifikacje;</li>
                <li>weryfikację tożsamości Specjalisty;</li>
                <li>ocenę doświadczenia zawodowego;</li>
                <li>sprawdzenie braku przeciwwskazań do wykonywania zawodu.</li>
              </ul>
              <p>
                3. Status "Zweryfikowany" przyznawany jest po pierwszym zakupie pakietu płatnego i pozytywnej weryfikacji.
              </p>
              <p>
                4. Specjaliści zobowiązani są do:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>świadczenia usług zgodnie z etyką zawodową;</li>
                <li>zachowania tajemnicy zawodowej;</li>
                <li>informowania o ograniczeniach i przeciwwskazaniach;</li>
                <li>posiadania odpowiedniego ubezpieczenia OC;</li>
                <li>prowadzenia dokumentacji zgodnie z przepisami;</li>
                <li>aktualizowania swoich kwalifikacji.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§8. Ochrona danych osobowych (RODO)</h2>
              <p>
                1. Administratorem danych osobowych jest PetsFlow Sp. z o.o.
              </p>
              <p>
                2. Dane osobowe przetwarzane są na podstawie:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>art. 6 ust. 1 lit. b RODO – wykonanie umowy;</li>
                <li>art. 6 ust. 1 lit. c RODO – obowiązek prawny;</li>
                <li>art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes;</li>
                <li>art. 6 ust. 1 lit. a RODO – zgoda (dla marketingu).</li>
              </ul>
              <p>
                3. Szczególne kategorie danych (dane zdrowotne zwierząt) przetwarzane są na podstawie zgody i wykonania umowy.
              </p>
              <p>
                4. Przetwarzamy następujące kategorie danych:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Dane identyfikacyjne: imię, nazwisko, adres e-mail;</li>
                <li>Dane kontaktowe: numer telefonu, adres;</li>
                <li>Dane profilowe: informacje o specjalizacji, wykształceniu, doświadczeniu zawodowym;</li>
                <li>Dane klientów i pacjentów: informacje o klientach i ich zwierzętach;</li>
                <li>Dane dotyczące wizyt i usług: harmonogramy, diagnozy, zalecenia;</li>
                <li>Dane techniczne: adres IP, dane o urządzeniu, logi systemowe.</li>
              </ul>
              <p>
                5. Dane przechowywane są przez okres:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>świadczenia usług i wypełniania obowiązków prawnych;</li>
                <li>przedawnienia roszczeń (3-6 lat);</li>
                <li>dla celów księgowych (5 lat);</li>
                <li>do momentu cofnięcia zgody (dane marketingowe).</li>
              </ul>
              <p>
                6. Użytkownik ma prawo do dostępu, sprostowania, usunięcia, ograniczenia przetwarzania, 
                przenoszenia danych oraz wniesienia sprzeciwu.
              </p>
              <p>
                7. Dane mogą być przekazywane do krajów trzecich wyłącznie z odpowiednimi zabezpieczeniami.
              </p>
              <p>
                8. Dane mogą być udostępniane:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Podmiotom przetwarzającym dane na zlecenie administratora;</li>
                <li>Dostawcom usług IT i hostingowych;</li>
                <li>Dostawcom systemów płatności online;</li>
                <li>Organom państwowym, gdy wynika to z obowiązku prawnego.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§9. Bezpieczeństwo i ochrona danych</h2>
              <p>
                1. Usługodawca stosuje odpowiednie środki techniczne i organizacyjne:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>szyfrowanie danych (SSL/TLS);</li>
                <li>bezpieczne przechowywanie haseł;</li>
                <li>regularne kopie zapasowe;</li>
                <li>monitoring bezpieczeństwa;</li>
                <li>kontrola dostępu do danych;</li>
                <li>szkolenia personelu w zakresie ochrony danych.</li>
              </ul>
              <p>
                2. W przypadku naruszenia ochrony danych Użytkownicy zostaną powiadomieni zgodnie z RODO.
              </p>
              <p>
                3. Dane przechowywane są w centrum danych Supabase z certyfikatami SOC 2 Type II i ISO 27001.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§10. Cookies i technologie śledzące</h2>
              <p>
                1. Serwis używa plików cookies do:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>zapewnienia funkcjonalności (cookies niezbędne);</li>
                <li>personalizacji treści (cookies preferencji);</li>
                <li>analizy ruchu (cookies analityczne);</li>
                <li>wyświetlania reklam (cookies marketingowe).</li>
              </ul>
              <p>
                2. Użytkownik może zarządzać cookies w ustawieniach przeglądarki.
              </p>
              <p>
                3. Wyłączenie cookies może ograniczyć funkcjonalność Serwisu.
              </p>
              <p>
                4. Używamy również technologii takich jak Google Analytics i Facebook Pixel za zgodą Użytkownika.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§11. Odpowiedzialność i ograniczenia</h2>
              <p>
                1. Usługodawca nie ponosi odpowiedzialności za:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>jakość usług świadczonych przez Specjalistów;</li>
                <li>szkody wynikające z nieprawidłowego korzystania z Serwisu;</li>
                <li>utratę danych spowodowaną działaniem siły wyższej;</li>
                <li>treści zamieszczane przez Użytkowników;</li>
                <li>decyzje podejmowane na podstawie informacji z Serwisu;</li>
                <li>skutki leczenia lub opieki nad zwierzętami;</li>
                <li>przerwy w działaniu Serwisu wynikające z przyczyn technicznych;</li>
                <li>szkody wynikające z działania siły wyższej.</li>
              </ul>
              <p>
                2. Odpowiedzialność Usługodawcy ograniczona jest do wysokości opłat uiszczonych przez Użytkownika w okresie 12 miesięcy.
              </p>
              <p>
                3. Serwis służy wyłącznie do organizacji opieki nad zwierzętami i nie zastępuje bezpośredniej konsultacji z lekarzem weterynarii.
              </p>
              <p>
                4. W przypadku sytuacji zagrażających życiu zwierzęcia należy niezwłocznie skontaktować się z lekarzem weterynarii.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§12. Właściwość intelektualna</h2>
              <p>
                1. Wszystkie prawa do Serwisu, w tym kod źródłowy, design, logo, nazwy należą do Usługodawcy.
              </p>
              <p>
                2. Użytkownik może korzystać z Serwisu wyłącznie zgodnie z przeznaczeniem.
              </p>
              <p>
                3. Zabronione jest kopiowanie, modyfikowanie lub rozpowszechnianie elementów Serwisu bez zgody.
              </p>
              <p>
                4. Treści tworzone przez Użytkowników pozostają ich własnością, ale udzielają Usługodawcy licencji na ich wykorzystanie w ramach Serwisu.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§13. Reklamacje i rozwiązywanie sporów</h2>
              <p>
                1. Reklamacje należy składać na adres: kontakt@petsflow.pl lub pocztą na adres siedziby.
              </p>
              <p>
                2. Reklamacja powinna zawierać:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>dane kontaktowe Użytkownika;</li>
                <li>szczegółowy opis problemu;</li>
                <li>żądanie sposobu rozpatrzenia;</li>
                <li>dowody (screenshots, dokumenty).</li>
              </ul>
              <p>
                3. Reklamacje rozpatrywane są w terminie 14 dni roboczych.
              </p>
              <p>
                4. Konsument może skorzystać z pozasądowych sposobów rozwiązywania sporów:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Rzecznik Finansowy (www.rf.gov.pl);</li>
                <li>Europejska Platforma ODR (ec.europa.eu/consumers/odr);</li>
                <li>sądy polubowne przy Krajowej Izbie Gospodarczej.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§14. Marketing i komunikacja</h2>
              <p>
                1. Wysyłanie materiałów marketingowych wymaga zgody Użytkownika.
              </p>
              <p>
                2. Zgoda może zostać cofnięta w dowolnym momencie poprzez:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>link "wypisz się" w wiadomości e-mail;</li>
                <li>ustawienia konta;</li>
                <li>kontakt z obsługą klienta.</li>
              </ul>
              <p>
                3. Wiadomości transakcyjne (potwierdzenia, faktury) wysyłane są bez względu na zgodę marketingową.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§15. Zmiany Regulaminu</h2>
              <p>
                1. Usługodawca może zmienić Regulamin z ważnych przyczyn, takich jak:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>zmiany w prawie;</li>
                <li>wprowadzenie nowych funkcjonalności;</li>
                <li>wymagania bezpieczeństwa;</li>
                <li>decyzje organów regulacyjnych.</li>
              </ul>
              <p>
                2. O zmianach Użytkownicy zostaną powiadomieni z 14-dniowym wyprzedzeniem.
              </p>
              <p>
                3. Brak sprzeciwu w terminie 14 dni oznacza akceptację zmian.
              </p>
              <p>
                4. W przypadku sprzeciwu Użytkownik może rozwiązać umowę ze skutkiem natychmiastowym.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§16. Postanowienia końcowe</h2>
              <p>
                1. Do umów zawieranych przez Serwis stosuje się prawo polskie.
              </p>
              <p>
                2. Wszelkie spory rozstrzygane są przez sąd właściwy dla siedziby Usługodawcy, z zastrzeżeniem przepisów o właściwości sądów konsumenckich.
              </p>
              <p>
                3. Jeśli którekolwiek postanowienie Regulaminu zostanie uznane za nieważne, pozostałe postanowienia zachowują moc.
              </p>
              <p>
                4. Korespondencja między stronami odbywa się w języku polskim.
              </p>
              <p>
                5. Regulamin wchodzi w życie z dniem 28 czerwca 2025 r.
              </p>
              <p>
                6. Wcześniejsze wersje Regulaminu dostępne są na żądanie pod adresem kontakt@petsflow.pl.
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-2xl font-semibold">Załącznik: Informacje dodatkowe</h2>
              <p>
                <strong>Formularz odstąpienia od umowy:</strong><br />
                Adresat: PetsFlow Sp. z o.o., ul. Główna 123, 00-001 Warszawa<br />
                Email: kontakt@petsflow.pl<br />
                <br />
                Niniejszym informuję/informujemy o moim/naszym odstąpieniu od umowy o świadczenie usługi:<br />
                - Data zawarcia umowy: ___________<br />
                - Imię i nazwisko konsumenta: ___________<br />
                - Adres konsumenta: ___________<br />
                - Podpis konsumenta: ___________<br />
                - Data: ___________
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
