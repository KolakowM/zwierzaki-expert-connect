import MainLayout from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";

export default function Terms2() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Regulamin</h1>
          </div>

          <p className="text-muted-foreground">Ostatnia aktualizacja: 05.04.2025</p>
          
          <div className="space-y-8 pt-4">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§1. Postanowienia ogólne</h2>
              <p>
                1. Niniejszy regulamin określa zasady świadczenia usług drogą elektroniczną w ramach 
                serwisu internetowego PetsFlow, dostępnego pod adresem www.petsflow.pl.
              </p>
              <p>
                2. Właścicielem i operatorem serwisu PetsFlow jest PetsFlow Sp. z o.o. 
                z siedzibą w Warszawie, ul. Zwierzęca 123, 00-001 Warszawa, wpisana do rejestru 
                przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS: 0000000000, 
                NIP: 0000000000, REGON: 000000000.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§2. Definicje</h2>
              <p>
                Na potrzeby niniejszego regulaminu przyjmuje się następujące znaczenie pojęć:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Serwis</strong> – platforma internetowa PetsFlow dostępna pod adresem www.petsflow.pl;</li>
                <li><strong>Usługodawca</strong> – PetsFlow Sp. z o.o. z siedzibą w Warszawie;</li>
                <li><strong>Użytkownik</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, korzystająca z Serwisu;</li>
                <li><strong>Specjalista</strong> – Użytkownik świadczący usługi w zakresie opieki nad zwierzętami;</li>
                <li><strong>Klient</strong> – Użytkownik korzystający z usług Specjalisty;</li>
                <li><strong>Konto</strong> – zbiór zasobów i uprawnień w ramach Serwisu przypisanych do konkretnego Użytkownika;</li>
                <li><strong>Abonament</strong> – odpłatny dostęp do pełnej funkcjonalności Serwisu przez określony czas.</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§3. Rejestracja i zasady korzystania z Serwisu</h2>
              <p>
                1. Korzystanie z pełnej funkcjonalności Serwisu wymaga założenia Konta. Rejestracja 
                jest dobrowolna i bezpłatna.
              </p>
              <p>
                2. W celu rejestracji Użytkownik zobowiązany jest wypełnić formularz rejestracyjny, 
                podając prawdziwe dane oraz zaakceptować niniejszy Regulamin i Politykę Prywatności.
              </p>
              <p>
                3. Po rejestracji Użytkownik otrzymuje dostęp do Konta i możliwość korzystania z 
                funkcjonalności Serwisu zgodnie z wybranym planem.
              </p>
              <p>
                4. Użytkownik zobowiązuje się do aktualizowania danych podanych podczas rejestracji 
                w przypadku ich zmiany.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§4. Plany i opłaty</h2>
              <p>
                1. Serwis oferuje różne plany dostępu do funkcjonalności:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Plan Podstawowy – bezpłatny, z ograniczoną funkcjonalnością;</li>
                <li>Plan Profesjonalny – płatny, z rozszerzoną funkcjonalnością;</li>
                <li>Plan Klinika – płatny, z pełną funkcjonalnością.</li>
              </ul>
              <p>
                2. Szczegółowy opis planów i cennik dostępne są na stronie Serwisu.
              </p>
              <p>
                3. Płatności za plany abonamentowe realizowane są z góry za wybrany okres.
              </p>
              <p>
                4. W przypadku rezygnacji z płatnego planu przed upływem opłaconego okresu, 
                Użytkownikowi nie przysługuje zwrot uiszczonej opłaty.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§5. Prawa i obowiązki Użytkownika</h2>
              <p>
                1. Użytkownik ma prawo do:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Korzystania z Serwisu zgodnie z jego przeznaczeniem;</li>
                <li>Modyfikowania i uzupełniania swoich danych w ramach Konta;</li>
                <li>Zgłaszania uwag i sugestii dotyczących działania Serwisu;</li>
                <li>Usunięcia swojego Konta w dowolnym momencie.</li>
              </ul>
              <p>
                2. Użytkownik zobowiązuje się do:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Przestrzegania postanowień niniejszego Regulaminu;</li>
                <li>Podawania prawdziwych danych;</li>
                <li>Niepodejmowania działań zakłócających działanie Serwisu;</li>
                <li>Niezamieszczania treści o charakterze bezprawnym.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§6. Odpowiedzialność</h2>
              <p>
                1. Usługodawca dokłada wszelkich starań, aby Serwis działał prawidłowo i bez zakłóceń, 
                jednak nie gwarantuje nieprzerwanej dostępności Serwisu.
              </p>
              <p>
                2. Usługodawca nie ponosi odpowiedzialności za:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Szkody wynikłe z nieprawidłowego korzystania z Serwisu;</li>
                <li>Utratę danych spowodowaną awarią systemu lub działaniem siły wyższej;</li>
                <li>Treści zamieszczane przez Użytkowników;</li>
                <li>Jakość usług świadczonych przez Specjalistów.</li>
              </ul>
              <p>
                3. Usługodawca zastrzega sobie prawo do czasowego zawieszenia działania 
                Serwisu w celu przeprowadzenia prac konserwacyjnych lub aktualizacji.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§7. Reklamacje</h2>
              <p>
                1. Użytkownik ma prawo składać reklamacje dotyczące funkcjonowania Serwisu.
              </p>
              <p>
                2. Reklamacje należy kierować na adres e-mail: kontakt@petsflow.pl 
                lub listownie na adres siedziby Usługodawcy.
              </p>
              <p>
                3. Reklamacja powinna zawierać: dane Użytkownika, opis problemu oraz oczekiwania 
                co do sposobu rozpatrzenia reklamacji.
              </p>
              <p>
                4. Usługodawca rozpatruje reklamacje w terminie 14 dni od daty ich otrzymania.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">§8. Postanowienia końcowe</h2>
              <p>
                1. Usługodawca zastrzega sobie prawo do zmiany niniejszego Regulaminu. 
                Zmiany wchodzą w życie po upływie 14 dni od daty ich publikacji w Serwisie.
              </p>
              <p>
                2. O zmianach Regulaminu Użytkownicy zostaną poinformowani poprzez komunikat 
                w Serwisie lub wiadomość e-mail.
              </p>
              <p>
                3. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają 
                przepisy prawa polskiego.
              </p>
              <p>
                4. Wszelkie spory wynikłe z korzystania z Serwisu będą rozstrzygane przez 
                sąd właściwy dla siedziby Usługodawcy.
              </p>
              <p>
                5. Regulamin wchodzi w życie z dniem 05.04.2025 r.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
