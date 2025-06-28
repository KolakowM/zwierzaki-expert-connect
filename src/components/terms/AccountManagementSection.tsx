
export default function AccountManagementSection() {
  return (
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
  );
}
