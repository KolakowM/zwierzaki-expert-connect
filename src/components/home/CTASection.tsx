
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function CTASection() {
  const { t } = useTranslation();

  return (
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
  );
}
