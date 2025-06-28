
export default function DataProtectionSection() {
  return (
    <>
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
    </>
  );
}
