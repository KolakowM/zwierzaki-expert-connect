import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, X, Zap } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const BlackFridayAlert = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const promoEndDate = new Date("2025-11-30T23:59:59");
  const { days, hours, minutes, seconds, isExpired } = useCountdown(promoEndDate);

  useEffect(() => {
    const dismissed = localStorage.getItem("bf-dashboard-alert-dismissed");
    if (!dismissed && !isExpired) {
      setIsVisible(true);
    }
  }, [isExpired]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("bf-dashboard-alert-dismissed", "true");
  };

  if (!isVisible || isExpired) return null;

  return (
    <Alert className="relative border-2 border-primary bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 shadow-lg overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground p-1 h-6 w-6"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Zamknij</span>
      </Button>

      <div className="relative space-y-3 pr-8">
        <AlertTitle className="flex items-center gap-2 text-lg font-bold">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Black Friday Special - Tylko dla Ciebie!
          <Badge variant="secondary" className="ml-2">
            <Zap className="h-3 w-3 mr-1" />
            90 dni za darmo
          </Badge>
        </AlertTitle>

        <AlertDescription className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">
              🎉 <strong>Pakiet Zaawansowany</strong> przez 3 miesiące całkowicie za darmo - bez karty kredytowej!
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Do 25 klientów i 40 zwierząt</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Widoczność w katalogu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Status Zweryfikowany</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Dostęp do karuzeli</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-background/50 rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Oferta kończy się za:</span>
            </div>
            <span className="text-base font-mono font-bold text-primary tabular-nums">
              {days}d {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </span>
          </div>

          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1 font-semibold shadow-md hover:scale-105 transition-transform">
              <a href="https://buy.stripe.com/eVqfZh2Vubp62ex6gg77O02" target="_blank" rel="noopener noreferrer">
                <Sparkles className="mr-2 h-4 w-4" />
                Aktywuj teraz
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="/pricing">Zobacz szczegóły</a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Bez zobowiązań • Anuluj w każdej chwili • Oszczędzasz 297 PLN
          </p>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default BlackFridayAlert;
