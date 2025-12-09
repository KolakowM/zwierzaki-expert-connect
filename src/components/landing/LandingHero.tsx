import { Button } from "@/components/ui/button";
import { ArrowDown, UserCheck, Bot } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingHero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-6">
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">AI nie zastąpi prawdziwego eksperta</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Twój pupil zasługuje na{" "}
            <span className="text-primary">prawdziwego eksperta</span>,
            <br />nie na chatbota
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Właściciele zwierząt coraz częściej szukają odpowiedzi w AI, bo baza specjalistów jest rozproszona. 
            PetsFlow łączy Cię bezpośrednio z zweryfikowanymi ekspertami. 
            Dbanie o dobrostan zwierząt nie powinno być oddane sztucznej inteligencji.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link to="/register">
                <UserCheck className="mr-2 h-5 w-5" />
                Dołącz do PetsFlow
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection("for-specialists")}
            >
              Dowiedz się więcej
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Dla specjalistów
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              Dla właścicieli zwierząt
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              0% prowizji
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
