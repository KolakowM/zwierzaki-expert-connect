
import { Button } from "@/components/ui/button";
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

export function FeaturedSpecialistsSection() {
  const { t } = useTranslation();
  const { specialists, loading, error } = useFeaturedSpecialists(12);

  // Use fallback data if no specialists are loaded and not loading
  const displaySpecialists = specialists.length > 0 ? specialists : (!loading ? fallbackSpecialists : []);
  
  console.log("Index page - specialists count:", specialists.length, "loading:", loading, "displaySpecialists:", displaySpecialists.length);
  console.log("Featured specialists in display list:", displaySpecialists.filter(s => s.is_featured).length);

  return (
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
  );
}
