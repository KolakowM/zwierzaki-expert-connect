
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface CouponData {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  description?: string;
  stripe_coupon_id?: string;
}

interface CouponInputProps {
  onCouponValidated: (coupon: CouponData | null) => void;
  disabled?: boolean;
  stripePriceId?: string;
}

export default function CouponInput({ onCouponValidated, disabled = false, stripePriceId }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validatedCoupon, setValidatedCoupon] = useState<CouponData | null>(null);
  const { toast } = useToast();

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Błąd",
        description: "Wprowadź kod promocyjny",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      console.log('Validating coupon:', couponCode, 'for price ID:', stripePriceId);
      
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { 
          code: couponCode.trim().toUpperCase(),
          stripePriceId 
        }
      });

      console.log('Coupon validation response:', { data, error });

      if (error) {
        throw error;
      }

      if (data.valid) {
        setValidationStatus('valid');
        setValidatedCoupon(data.coupon);
        onCouponValidated(data.coupon);
        toast({
          title: "Kod promocyjny zastosowany!",
          description: data.message || `Otrzymujesz ${data.coupon.discount_type === 'percentage' ? `${data.coupon.discount_value}%` : `${data.coupon.discount_value} zł`} zniżki`,
        });
      } else {
        setValidationStatus('invalid');
        setValidatedCoupon(null);
        onCouponValidated(null);
        toast({
          title: "Nieprawidłowy kod",
          description: data.message || "Kod promocyjny jest nieprawidłowy",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setValidationStatus('invalid');
      setValidatedCoupon(null);
      onCouponValidated(null);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas sprawdzania kodu promocyjnego",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const resetCoupon = () => {
    setCouponCode("");
    setValidationStatus('idle');
    setValidatedCoupon(null);
    onCouponValidated(null);
  };

  const getStatusIcon = () => {
    if (isValidating) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (validationStatus === 'valid') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (validationStatus === 'invalid') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getDiscountText = () => {
    if (!validatedCoupon) return null;
    
    const { discount_type, discount_value } = validatedCoupon;
    return discount_type === 'percentage' 
      ? `${discount_value}% zniżki` 
      : `${discount_value} zł zniżki`;
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Wprowadź kod promocyjny"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            disabled={disabled || isValidating || validationStatus === 'valid'}
            className="pr-10"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && validationStatus !== 'valid') {
                validateCoupon();
              }
            }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>
        
        {validationStatus === 'valid' ? (
          <Button
            type="button"
            variant="outline"
            onClick={resetCoupon}
            disabled={disabled}
          >
            Usuń
          </Button>
        ) : (
          <Button
            type="button"
            onClick={validateCoupon}
            disabled={disabled || isValidating || !couponCode.trim()}
          >
            {isValidating ? "Sprawdzam..." : "Zastosuj"}
          </Button>
        )}
      </div>
      
      {validationStatus === 'valid' && validatedCoupon && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                Kod promocyjny: {validatedCoupon.code}
              </p>
              <p className="text-sm text-green-600">
                {getDiscountText()}
              </p>
              {validatedCoupon.description && (
                <p className="text-xs text-green-600 mt-1">
                  {validatedCoupon.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
