import { X, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { useTranslation } from "react-i18next";

const BlackFridayBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  
  // End of November 2025: 30th November 23:59:59
  const promoEndDate = new Date('2025-11-30T23:59:59');
  const { days, hours, minutes, seconds, isExpired } = useCountdown(promoEndDate);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem('bf-banner-dismissed');
    if (!dismissed && !isExpired) {
      setIsVisible(true);
    }
  }, [isExpired]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('bf-banner-dismissed', 'true');
  };

  if (!isVisible || isExpired) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      
      <div className="container relative py-3 px-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Sparkles className="h-5 w-5 text-primary-foreground flex-shrink-0 animate-pulse" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
              <span className="text-sm sm:text-base font-bold text-primary-foreground">
                🎉 Black Friday Special!
              </span>
              <span className="text-xs sm:text-sm text-primary-foreground/90">
                90 dni pakietu Zaawansowany za darmo - bez karty kredytowej!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Countdown timer */}
            <div className="hidden sm:flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Clock className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-mono font-bold text-primary-foreground tabular-nums">
                {days}d {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>

            <Button 
              asChild
              size="sm"
              variant="secondary"
              className="font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              <a 
                href="https://buy.stripe.com/eVqfZh2Vubp62ex6gg77O02" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Aktywuj teraz
              </a>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-primary-foreground hover:bg-primary-foreground/20 p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Zamknij</span>
            </Button>
          </div>
        </div>

        {/* Mobile countdown */}
        <div className="sm:hidden flex items-center justify-center gap-2 mt-2 bg-primary-foreground/20 backdrop-blur-sm px-3 py-1.5 rounded-lg w-fit mx-auto">
          <Clock className="h-4 w-4 text-primary-foreground" />
          <span className="text-sm font-mono font-bold text-primary-foreground tabular-nums">
            {days}d {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlackFridayBanner;
