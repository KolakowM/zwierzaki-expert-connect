
export default function FinalProvisionsSection() {
  return (
    <>
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
          {/*} Adresat: PetsFlow Sp. z o.o., ul. Główna 123, 00-001 Warszawa<br /> */}
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
    </>
  );
}
