import MainLayout from "@/components/layout/MainLayout";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Warunki Korzystania</h1>
          </div>

          <p className="text-muted-foreground">Ostatnia aktualizacja: 05.04.2025</p>
          
          <div className="space-y-8 pt-4">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">1. Wstęp</h2>
              <p>
                Niniejsze Warunki Korzystania określają zasady użytkowania platformy internetowej PetsFlow, 
                dostępnej pod adresem www.petsflow.pl. Korzystając z platformy, użytkownik akceptuje poniższe 
                warunki i zobowiązuje się do ich przestrzegania.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">2. Definicje</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Platforma</strong> - serwis internetowy PetsFlow</li>
                <li><strong>Użytkownik</strong> - osoba korzystająca z Platformy</li>
                <li><strong>Specjalista</strong> - weterynarze, behawioryści, groomerzy i inni specjaliści zajmujący się zwierzętami</li>
                <li><strong>Klient</strong> - właściciel zwierzęcia korzystający z usług Specjalisty</li>
                <li><strong>Konto</strong> - zbiór zasobów i uprawnień przypisanych do Użytkownika w ramach Platformy</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">3. Rejestracja i konto użytkownika</h2>
              <p>
                Aby korzystać z pełni funkcjonalności Platformy, wymagane jest założenie konta. Podczas rejestracji 
                Użytkownik zobowiązany jest podać prawdziwe dane oraz aktualizować je w razie zmian. Użytkownik ponosi 
                odpowiedzialność za zachowanie poufności danych dostępowych do konta oraz za wszystkie działania 
                wykonywane przy użyciu jego konta.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">4. Usługi i opłaty</h2>
              <p>
                Platforma oferuje różne pakiety usług, zarówno bezpłatne jak i płatne. Szczegółowy opis usług oraz opłat 
                znajduje się na stronie cennika. Płatności za usługi są realizowane z góry, zgodnie z wybranym planem 
                abonamentowym. Faktury są wystawiane zgodnie z danymi podanymi przez Użytkownika.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">5. Prawa i obowiązki użytkownika</h2>
              <p>
                Użytkownik zobowiązuje się do:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Przestrzegania niniejszego regulaminu i przepisów prawa</li>
                <li>Nienaruszania praw innych Użytkowników</li>
                <li>Niestosowania działań mających na celu zakłócenie działania Platformy</li>
                <li>Nieudostępniania swojego konta osobom trzecim</li>
                <li>Niepublikowania treści obraźliwych, nielegalnych lub naruszających prawa osób trzecich</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">6. Odpowiedzialność</h2>
              <p>
                Platforma nie ponosi odpowiedzialności za:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Przerwy w działaniu Platformy wynikające z przyczyn technicznych</li>
                <li>Treści zamieszczane przez Użytkowników</li>
                <li>Jakość usług świadczonych przez Specjalistów</li>
                <li>Szkody wynikające z nieprawidłowego korzystania z Platformy</li>
                <li>Szkody wynikające z działania siły wyższej</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">7. Ochrona danych osobowych</h2>
              <p>
                Zasady przetwarzania danych osobowych Użytkowników zostały opisane w Polityce Prywatności, 
                dostępnej na Platformie. Użytkownik przyjmuje do wiadomości, że korzystanie z Platformy wiąże 
                się z przetwarzaniem jego danych osobowych.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">8. Prawa własności intelektualnej</h2>
              <p>
                Wszelkie prawa własności intelektualnej do Platformy, w tym do jej elementów graficznych, logotypów, 
                układu, treści oraz kodu źródłowego przysługują ExpertZwierzaki Sp. z o.o. lub podmiotom, z którymi 
                zawarła stosowne umowy. Korzystanie z Platformy nie oznacza nabycia jakichkolwiek praw do tych elementów.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">9. Rozwiązanie umowy</h2>
              <p>
                Użytkownik może w każdej chwili usunąć konto na Platformie. Administrator ma prawo do zablokowania 
                lub usunięcia konta Użytkownika w przypadku naruszenia niniejszego regulaminu lub przepisów prawa.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">10. Zmiany regulaminu</h2>
              <p>
                Administrator zastrzega sobie prawo do zmiany niniejszego regulaminu. O wszelkich zmianach Użytkownicy 
                zostaną poinformowani poprzez wiadomość e-mail lub komunikat na Platformie. Dalsze korzystanie z 
                Platformy po wprowadzeniu zmian oznacza ich akceptację.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">11. Postanowienia końcowe</h2>
              <p>
                W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego. 
                Wszelkie spory wynikające z korzystania z Platformy będą rozstrzygane przez sąd właściwy dla siedziby 
                Administratora.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
