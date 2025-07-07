
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Heart } from "lucide-react";
import { Addon } from "@/types/addon";

interface AddonCardProps {
  addon: Addon;
  onPurchase: (addon: Addon) => void;
  isPurchasing?: boolean;
}

const AddonCard = ({ addon, onPurchase, isPurchasing = false }: AddonCardProps) => {
  const formatPrice = (priceInGroszy: number) => {
    return (priceInGroszy / 100).toFixed(2);
  };

  const getAddonIcon = () => {
    switch (addon.addon_type) {
      case 'clients':
        return <Users className="h-5 w-5" />;
      case 'pets':
        return <Heart className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  const getAddonTypeLabel = () => {
    switch (addon.addon_type) {
      case 'clients':
        return 'Klienci';
      case 'pets':
        return 'Zwierzęta';
      default:
        return 'Dodatek';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getAddonIcon()}
            <Badge variant="secondary">{getAddonTypeLabel()}</Badge>
          </div>
        </div>
        <CardTitle className="text-lg">{addon.name}</CardTitle>
        {addon.description && (
          <CardDescription>{addon.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Zwiększenie limitu:</span>
            <span className="font-medium">+{addon.limit_increase}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cena miesięczna:</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(addon.price_pln)} PLN
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onPurchase(addon)}
          disabled={isPurchasing}
          className="w-full"
        >
          {isPurchasing ? (
            <>
              <span className="mr-2">Dodawanie...</span>
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj dodatek
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddonCard;
