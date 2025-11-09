import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Clock, Zap } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { useTranslation } from "react-i18next";

const BlackFridayPricingCard = () => {
  const { t } = useTranslation();
  const promoEndDate = new Date('2025-11-30T23:59:59');
  const { days, hours, minutes, seconds, isExpired } = useCountdown(promoEndDate);

  if (isExpired) return null;

  const features = [
    "90 dni pełnego dostępu za darmo",
    "Bez karty kredytowej",
    "Do 100 klientów i zwierząt",
    "Widoczność w katalogu",
    "Status: Zweryfikowany",
    "Dostęp do karuzeli na stronie głównej",
    "Pełna funkcjonalność CRM",
    "Anuluj w każdej chwili"
  ];

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-lg blur-lg opacity-30 animate-pulse" />
      
      <Card className="relative border-2 border-primary shadow-2xl overflow-hidden">
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

        <CardHeader className="relative space-y-4 pb-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">
                Pakiet Zaawansowany
              </CardTitle>
              <CardDescription className="text-base">
                Oferta specjalna Black Friday
              </CardDescription>
            </div>
          </div>

          {/* Price section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary">0 PLN</span>
              <span className="text-muted-foreground line-through text-xl">99 PLN/mies</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                <Zap className="h-3 w-3 mr-1" />
                Oszczędzasz 297 PLN
              </Badge>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Oferta kończy się za:</span>
              </div>
              <span className="text-lg font-mono font-bold text-primary tabular-nums">
                {days}d {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">🎁 Co dostajesz:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Natychmiastowy dostęp po rejestracji</li>
              <li>• Pełna funkcjonalność przez 3 miesiące</li>
              <li>• Automatyczne przypomnienie przed końcem</li>
              <li>• Możliwość kontynuacji lub anulowania</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="relative flex flex-col gap-3">
          <Button 
            asChild
            size="lg" 
            className="w-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <a 
              href="https://buy.stripe.com/eVqfZh2Vubp62ex6gg77O02" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Aktywuj ofertę Black Friday
            </a>
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Bez zobowiązań • Bez karty płatniczej • Anuluj w każdej chwili
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlackFridayPricingCard;
