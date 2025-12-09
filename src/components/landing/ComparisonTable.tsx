import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonRow {
  feature: string;
  excel: string | boolean;
  notion: string | boolean;
  petsflow: string | boolean;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Stworzone specjalnie dla branży zwierzęcej",
    excel: false,
    notion: false,
    petsflow: true,
  },
  {
    feature: "Gotowa kartoteka pacjenta",
    excel: "Ręczna konfiguracja",
    notion: "Ręczna konfiguracja",
    petsflow: "Wbudowany szablon",
  },
  {
    feature: "Historia wizyt z zaleceniami",
    excel: "Ręczna konfiguracja",
    notion: "Ręczna konfiguracja",
    petsflow: true,
  },
  {
    feature: "Programy opieki dla zwierząt",
    excel: false,
    notion: false,
    petsflow: true,
  },
  {
    feature: "Szybkie wyszukiwanie pacjentów",
    excel: "Ograniczone",
    notion: "Średnio wygodne",
    petsflow: "Zoptymalizowane",
  },
  {
    feature: "Notatki z załącznikami",
    excel: false,
    notion: true,
    petsflow: true,
  },
  {
    feature: "Weryfikacja specjalisty",
    excel: false,
    notion: false,
    petsflow: "Weryfikowany profil",
  },
  {
    feature: "Profil w katalogu specjalistów",
    excel: false,
    notion: false,
    petsflow: true,
  },
  {
    feature: "Gotowe do użycia od razu",
    excel: false,
    notion: "Wymaga konfiguracji",
    petsflow: true,
  },
  {
    feature: "Koszt miesięczny",
    excel: '"Darmowy", drogi w czasie',
    notion: "Abonament w $",
    petsflow: "0 / 9,99 / 19,99 zł",
  },
];

function CellValue({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  if (value === true) {
    return (
      <div className={cn("flex justify-center", highlight && "text-primary")}>
        <Check className="h-5 w-5 text-green-500" />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <X className="h-5 w-5 text-destructive/60" />
      </div>
    );
  }
  return (
    <span className={cn("text-sm", highlight ? "text-primary font-medium" : "text-muted-foreground")}>
      {value}
    </span>
  );
}

export default function ComparisonTable() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            PetsFlow vs Excel i Notion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dlaczego dedykowane narzędzie jest lepsze od uniwersalnych arkuszy i notatników?
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Funkcja</th>
                <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Excel</th>
                <th className="text-center py-4 px-4 font-semibold text-muted-foreground">Notion</th>
                <th className="text-center py-4 px-4 font-semibold text-primary bg-primary/5 rounded-t-lg">
                  PetsFlow
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    "border-b border-border/50",
                    index % 2 === 0 && "bg-background/50"
                  )}
                >
                  <td className="py-3 px-4 text-sm text-foreground">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    <CellValue value={row.excel} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CellValue value={row.notion} />
                  </td>
                  <td className="py-3 px-4 text-center bg-primary/5">
                    <CellValue value={row.petsflow} highlight />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
