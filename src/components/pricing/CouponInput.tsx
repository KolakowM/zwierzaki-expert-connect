
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CouponInputProps {
  onCouponApplied: (couponCode: string) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: string;
  disabled?: boolean;
  priceId?: string;
}

export default function CouponInput({ 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon,
  disabled = false,
  priceId
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Błąd",
        description: "Wprowadź kod promocyjny",
        variant: "destructive",
      });
      return;
    }

    if (!priceId) {
      toast({
        title: "Błąd",
        description: "Nie można zwalidować kuponu - brak informacji o cenie",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { 
          couponCode: couponCode.trim().toUpperCase(),
          priceId: priceId
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error('Błąd podczas walidacji kuponu');
      }

      if (data.valid) {
        onCouponApplied(couponCode.trim().toUpperCase());
        toast({
          title: "Kod promocyjny zastosowany",
          description: `Kupon ${couponCode.toUpperCase()} został pomyślnie zastosowany`,
        });
      } else {
        toast({
          title: "Nieprawidłowy kod promocyjny",
          description: data.error || "Kod promocyjny nie jest ważny",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas sprawdzania kodu promocyjnego",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    onCouponRemoved();
    toast({
      title: "Kod promocyjny",
      description: "Kod promocyjny został usunięty",
    });
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
        <span className="text-sm font-medium text-green-800">
          Kod promocyjny: {appliedCoupon}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemoveCoupon}
          disabled={disabled}
        >
          Usuń
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Wprowadź kod promocyjny"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          disabled={disabled || isValidating}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleApplyCoupon();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleApplyCoupon}
          disabled={disabled || isValidating || !couponCode.trim()}
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Zastosuj"
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Wprowadź kod promocyjny, aby otrzymać zniżkę
      </p>
    </div>
  );
}
