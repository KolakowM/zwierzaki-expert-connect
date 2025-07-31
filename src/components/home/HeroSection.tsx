
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation();

  return (
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
                src="https://wrftbhmnqrdogomhvomr.supabase.co/storage/v1/object/public/profiles/profile-photos/ChatGPT%20Image%2031%20lip%202025,%2018_51_51.png"
                alt="wzór postaci z łapką"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
