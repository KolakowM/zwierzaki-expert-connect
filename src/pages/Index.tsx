import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { SpecialistCard, Specialist } from "@/components/specialists/SpecialistCard";
import { useTranslation } from "react-i18next";
import { useFeaturedSpecialists } from "@/hooks/useFeaturedSpecialists";
import { Loader2 } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

// Fallback specialists data for demonstration - now includes is_featured
const fallbackSpecialists: Specialist[] = [
  {
    id: "fallback-1",
    name: "Anna Kowalska",
    title: "Dietetyk zwierzęcy",
    specializations: ["Dietetyka", "Żywienie psów", "Alergie pokarmowe"],
    location: "Warszawa",
    image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=2376&auto=format&fit=crop",
    rating: 4.9,
    verified: true,
    role: "specialist",
    is_featured: true
  },
  {
    id: "fallback-2",
    name: "Piotr Nowak",
    title: "Behawiorysta psów",
    specializations: ["Behawiorystyka", "Terapia lękowa", "Agresja"],
    location: "Kraków",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2369&auto=format&fit=crop",
    rating: 5.0,
    verified: true,
    role: "specialist",
    is_featured: false
  },
  {
    id: "fallback-3",
    name: "Magdalena Wiśniewska",
    title: "Fizjoterapeuta zwierzęcy",
    specializations: ["Rehabilitacja", "Fizjoterapia", "Masaż"],
    location: "Wrocław",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2374&auto=format&fit=crop",
    rating: 4.8,
    verified: true,
    role: "specialist",
    is_featured: true
  },
  {
    id: "fallback-4",
    name: "Tomasz Kaczmarek",
    title: "Trener psów",
    specializations: ["Szkolenie podstawowe", "Posłuszeństwo", "Trick training"],
    location: "Poznań",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2368&auto=format&fit=crop",
    rating: 4.7,
    verified: true,
    role: "specialist",
    is_featured: false
  },
  {
    id: "fallback-5",
    name: "Katarzyna Zielińska",
    title: "Weterynarz",
    specializations: ["Chirurgia", "Diagnostyka", "Medycyna wewnętrzna"],
    location: "Gdańsk",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2374&auto=format&fit=crop",
    rating: 4.9,
    verified: true,
    role: "specialist",
    is_featured: true
  },
  {
    id: "fallback-6",
    name: "Michał Nowicki",
    title: "Groomer",
    specializations: ["Strzyżenie", "Pielęgnacja", "SPA dla zwierząt"],
    location: "Łódź",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2370&auto=format&fit=crop",
    rating: 4.6,
    verified: true,
    role: "specialist",
    is_featured: false
  }
];

const Index = () => {
  const { t } = useTranslation();
  const { specialists, loading, error } = useFeaturedSpecialists(12);

  // Use fallback data if no specialists are loaded and not loading
  const displaySpecialists = specialists.length > 0 ? specialists : (!loading ? fallbackSpecialists : []);
  
  console.log("Index page - specialists count:", specialists.length, "loading:", loading, "displaySpecialists:", displaySpecialists.length);
  console.log("Featured specialists in display list:", displaySpecialists.filter(s => s.is_featured).length);

  const benefitsData = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-primary"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: t("benefits.verified_specialists_title"),
      description: t("benefits.verified_specialists_desc")
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-primary"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: t("benefits.experienced_professionals_title"),
      description: t("benefits.experienced_professionals_desc")
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 text-primary"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      ),
      title: t("benefits.easy_appointments_title"),
      description: t("benefits.easy_appointments_desc")
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-pattern py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span dangerouslySetInnerHTML={{
                  __html: t('home.hero_title').replace('najlepszego specjalistę', '<span class="text-primary">najlepszego specjalistę</span>')
                }} />
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('home.hero_description')}
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link to="/catalog">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('home.browse_specialists')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    {t('home.join_specialist')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="aspect-square overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop"
                  alt="Weterynarz badający psa"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 aspect-square w-1/2 overflow-hidden rounded-xl border-4 border-white shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1603123853880-a92fafb7809f?q=80&w=2369&auto=format&fit=crop"
                  alt="Kot u weterynarza"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Specialists Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('home.featured_specialists')}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('home.featured_description')}
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2">Ładowanie specjalistów...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Nie udało się załadować specjalistów. Spróbuj ponownie później.</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Odśwież stronę
              </Button>
            </div>
          ) : displaySpecialists.length > 0 ? (
            <div className="relative">
              <Carousel 
                className="w-full"
                randomStart={true}
                autoplay={true}
                autoplayDelay={3500}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {displaySpecialists.map(specialist => (
                    <CarouselItem key={specialist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                      <div className="h-full">
                        <SpecialistCard specialist={specialist} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="left-0 -translate-x-1/2" />
                  <CarouselNext className="right-0 translate-x-1/2" />
                </div>
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Brak dostępnych specjalistów w tym momencie.</p>
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Link to="/catalog">
              <Button variant="outline" size="lg">
                {t('home.view_all_specialists')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">{t('home.why_platform')}</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('home.platform_description')}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {benefitsData.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="mb-2 text-xl font-medium">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="rounded-xl bg-primary/10 p-8 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                {t('home.are_you_specialist')}
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                {t('home.specialist_cta')}
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('auth.register_title')}
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    {t('header.pricing')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
