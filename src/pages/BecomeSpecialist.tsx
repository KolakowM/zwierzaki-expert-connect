
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { UserPlus, CheckCircle, Clock, Calendar, PieChart, FilePlus } from "lucide-react";

export default function BecomeSpecialist() {
  const benefits = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Zarządzanie terminarzem",
      description: "Efektywne planowanie wizyt, kontrola nad harmonogramem oraz automatyczne przypomnienia dla klientów."
    },
    {
      icon: <FilePlus className="h-10 w-10 text-primary" />,
      title: "Dokumentacja pacjentów",
      description: "Przechowywanie historii medycznej, zaleceń i dokumentów w jednym bezpiecznym miejscu."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Pozyskiwanie klientów",
      description: "Twój profil w katalogu specjalistów, widoczny dla potencjalnych klientów szukających usług."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Oszczędność czasu",
      description: "Automatyzacja rutynowych zadań administracyjnych, więcej czasu na pracę z pacjentami."
    },
    {
      icon: <PieChart className="h-10 w-10 text-primary" />,
      title: "Analityka biznesowa",
      description: "Raporty i statystyki pomagające zrozumieć trendy w Twojej praktyce i podejmować lepsze decyzje."
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Utwórz konto",
      description: "Zarejestruj się jako specjalista, podając podstawowe informacje o swojej praktyce."
    },
    {
      number: 2,
      title: "Uzupełnij profil",
      description: "Dodaj szczegółowe informacje o swoich usługach, doświadczeniu i specjalizacji."
    },
    {
      number: 3,
      title: "Zacznij korzystać",
      description: "Dodawaj klientów, pacjentów i rozpocznij zarządzanie swoją praktyką już dziś."
    }
  ];

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-5xl space-y-16">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <UserPlus className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Zostań Specjalistą na PetsFlow
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              Dołącz do społeczności profesjonalistów i skorzystaj z nowoczesnych narzędzi 
              do zarządzania praktyką weterynaryjną, behawioralną lub groomerską.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg">Zarejestruj się za darmo</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">Zobacz cennik</Button>
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-center text-3xl font-bold">Co zyskujesz?</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-4">{benefit.icon}</div>
                    <h3 className="mb-2 text-xl font-bold">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-center text-3xl font-bold">Jak zacząć?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="relative rounded-lg border bg-card p-6 shadow-sm">
                  <div className="absolute -top-4 left-6 rounded-full bg-primary px-4 py-1 text-lg font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-primary text-primary-foreground">
            <div className="p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">Gotowy, by rozwijać swoją praktykę?</h2>
              <p className="mb-6 text-lg">
                Dołącz do PetsFlow już dziś i zacznij korzystać z nowoczesnych narzędzi.
              </p>
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Rozpocznij teraz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
