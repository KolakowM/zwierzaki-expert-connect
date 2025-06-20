
import MainLayout from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSpecialistsSection } from "@/components/home/FeaturedSpecialistsSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <MainLayout>

      <h1 className="sr-only">
        PetsFlow - Platforma dla specjalistów ds. zwierząt. Znajdź najlepszego specjalistę dla swojego zwierzaka.
      </h1>
      <HeroSection />
      <FeaturedSpecialistsSection />
      <BenefitsSection />
      <CTASection />

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
          ) : (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {specialists.slice(0, 8).map(specialist => (
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
              PetsFlow łączy właścicieli zwierząt z najlepszymi specjalistami w Polsce,
              gwarantując profesjonalną opiekę dla Twojego pupila.
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
