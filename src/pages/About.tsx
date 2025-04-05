
import MainLayout from "@/components/layout/MainLayout";
import { Info } from "lucide-react";

export default function About() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Info className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">O Platformie</h1>
          </div>
          
          <p className="text-lg text-muted-foreground">
            ExpertZwierzaki to kompleksowa platforma CRM dla specjalistów zajmujących się opieką nad zwierzętami.
          </p>

          <div className="space-y-8 pt-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Nasza Misja</h2>
              <p>
                Naszą misją jest dostarczenie specjalistom weterynarii, behawiorystom, groomingom i innym profesjonalistom 
                narzędzia, które usprawni zarządzanie praktyką, dokumentacją pacjentów i komunikacją z klientami.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Dla Kogo?</h2>
              <p>
                Platforma ExpertZwierzaki została stworzona z myślą o:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Weterynarzach i klinikach weterynaryjnych</li>
                <li>Behawiorystach zwierzęcych</li>
                <li>Groomerach i salonach pielęgnacji</li>
                <li>Rehabilitantach zwierzęcych</li>
                <li>Trenerach zwierząt</li>
                <li>Innych specjalistach opiekujących się zwierzętami</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Korzyści</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kompleksowe zarządzanie kartoteką pacjentów</li>
                <li>Intuicyjny kalendarz wizyt</li>
                <li>Automatyczne przypomnienia dla klientów</li>
                <li>Przechowywanie dokumentacji medycznej</li>
                <li>Promocja usług w katalogu specjalistów</li>
                <li>Komunikacja z klientami w jednym miejscu</li>
                <li>Dostęp z każdego urządzenia</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Nasza Historia</h2>
              <p>
                ExpertZwierzaki powstało z pasji do zwierząt i zrozumienia potrzeb specjalistów pracujących w branży.
                Platforma jest stale rozwijana w oparciu o feedback użytkowników, aby dostarczać najbardziej użytecznych
                funkcji dla nowoczesnej praktyki weterynaryjnej i około-weterynaryjnej.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
