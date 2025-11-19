
export default function SubscriptionSection() {
  return (
    <>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">§5. Pakiety i opłaty</h2>
        <p>
          1. Serwis oferuje następujące pakiety:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Testowy (0 zł)</strong> – ograniczona funkcjonalność, brak widoczności w katalogu;</li>
          <li><strong>Zaawansowany (9,99 zł/mies)</strong> – rozszerzona funkcjonalność, standardowa widoczność;</li>
          <li><strong>Zawodowiec (19,99 zł/mies)</strong> – pełna funkcjonalność, wyróżniona widoczność.</li>
        </ul>
        <p>
          2. Ceny zawierają podatek VAT zgodnie z obowiązującymi przepisami.
        </p>
        <p>
          3. Płatności realizowane są przez Stripe Inc., zgodnie z międzynarodowymi standardami bezpieczeństwa.
        </p>
        <p>
          4. Faktury VAT wystawiane są na prośbę użytkownika i przesyłane na adres e-mail podany przy rejestracji.
        </p>
        <p>
          5. W przypadku opłat cyklicznych, środki pobierane są automatycznie w dniu odnowienia subskrypcji.
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
    </>
  );
}
