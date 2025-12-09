import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingCTA() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Dołącz do PetsFlow już dziś
        </h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          Zacznij za darmo i przekonaj się, jak łatwo można zarządzać dokumentacją pacjentów.
          Bez zobowiązań, bez karty kredytowej.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              Załóż darmowe konto
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
            <Link to="/pricing">
              Zobacz cennik
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-primary-foreground/70">
          <Mail className="h-4 w-4" />
          <span className="text-sm">Masz pytania? Napisz do nas:</span>
          <a 
            href="mailto:kontakt@petsflow.pl" 
            className="text-sm font-medium hover:text-primary-foreground transition-colors"
          >
            kontakt@petsflow.pl
          </a>
        </div>
      </div>
    </section>
  );
}
