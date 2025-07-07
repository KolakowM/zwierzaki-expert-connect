
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, Heart, Plus, Minus } from "lucide-react";
import { UserAddon } from "@/types/addon";
import { useState } from "react";

interface UserAddonCardProps {
  userAddon: UserAddon;
  onUpdateQuantity: (userAddonId: string, newQuantity: number) => void;
  onCancel: (userAddonId: string) => void;
  isUpdating?: boolean;
}

const UserAddonCard = ({ userAddon, onUpdateQuantity, onCancel, isUpdating = false }: UserAddonCardProps) => {
  const [quantity, setQuantity] = useState(userAddon.quantity);

  const formatPrice = (priceInGroszy: number) => {
    return (priceInGroszy / 100).toFixed(2);
  };

  const getAddonIcon = () => {
    if (!userAddon.addon) return <Plus className="h-5 w-5" />;
    
    switch (userAddon.addon.addon_type) {
      case 'clients':
        return <Users className="h-5 w-5" />;
      case 'pets':
        return <Heart className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  const getAddonTypeLabel = () => {
    if (!userAddon.addon) return 'Dodatek';
    
    switch (userAddon.addon.addon_type) {
      case 'clients':
        return 'Klienci';
      case 'pets':
        return 'Zwierzęta';
      default:
        return 'Dodatek';
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onUpdateQuantity(userAddon.id, newQuantity);
  };

  if (!userAddon.addon) {
    return null;
  }

  const totalIncrease = userAddon.addon.limit_increase * quantity;
  const totalPrice = userAddon.addon.price_pln * quantity;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getAddonIcon()}
            <Badge variant="secondary">{getAddonTypeLabel()}</Badge>
          </div>
          <Badge variant="outline" className="text-green-600">Aktywny</Badge>
        </div>
        <CardTitle className="text-lg">{userAddon.addon.name}</CardTitle>
        {userAddon.addon.description && (
          <CardDescription>{userAddon.addon.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ilość:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isUpdating}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={isUpdating}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Całkowite zwiększenie:</span>
            <span className="font-medium">+{totalIncrease}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Miesięczny koszt:</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(totalPrice)} PLN
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Data zakupu:</span>
            <span className="text-sm">
              {new Date(userAddon.purchase_date).toLocaleDateString('pl-PL')}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="destructive"
          onClick={() => onCancel(userAddon.id)}
          disabled={isUpdating}
          className="w-full"
          size="sm"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Anuluj dodatek
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserAddonCard;
