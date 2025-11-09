import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Clock, Zap } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { useTranslation } from "react-i18next";

const BlackFridayPricingCard = () => {
  const { t } = useTranslation();
  const promoEndDate = new Date("2025-11-30T23:59:59");
  const { days, hours, minutes, seconds, isExpired } = useCountdown(promoEndDate);

  if (isExpired) return null;

  const features = [
    "90 dni pełnego dostępu za darmo",
    "Bez karty kredytowej",
    "Do 25 klientów i 40 zwierząt",
    "Widoczność w katalogu",
    "Status: Zweryfikowany",
    "Dostęp do karuzeli na stronie głównej",
    "Pełna funkcjonalność CRM",
    "Anuluj w każdej chwili",
  ];

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-lg blur-lg opacity-20 animate-pulse" />

      <Card className="relative border-2 border-primary shadow-lg overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />

        {/* Popular badge with sparkle */}
        <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold py-1 px-12 shadow-lg">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>BLACK FRIDAY</span>
            <Sparkles className="h-3 w-3" />
          </div>
        </div>

        <div className="relative grid md:grid-cols-[2fr,3fr] gap-4 md:gap-6 p-4 md:p-6">
          {/* Left column - Main info and CTA */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">Pakiet Zaawansowany</h3>
              <p className="text-sm text-muted-foreground">Oferta specjalna Black Friday</p>
            </div>

            {/* Price section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-bold text-primary">0 PLN</span>
                <span className="text-muted-foreground line-through text-base">99 PLN/mies</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Oszczędzasz 297 PLN
              </Badge>
            </div>

            {/* Countdown */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Kończy się za:</span>
                </div>
                <span className="text-base font-mono font-bold text-primary tabular-nums">
                  {days}d {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Button asChild size="lg" className="w-full font-bold shadow-lg hover:scale-105 transition-transform">
              <a href="https://buy.stripe.com/eVqfZh2Vubp62ex6gg77O02" target="_blank" rel="noopener noreferrer">
                <Sparkles className="mr-2 h-4 w-4" />
                Aktywuj ofertę Black Friday
              </a>
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Bez zobowiązań • Bez karty płatniczej • Anuluj w każdej chwili
            </p>
          </div>

          {/* Right column - Features in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 content-start">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </div>
                <span className="text-xs md:text-sm leading-tight">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BlackFridayPricingCard;
