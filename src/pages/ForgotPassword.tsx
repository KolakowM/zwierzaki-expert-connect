
import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "@/services/authService";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Błąd",
        description: "Proszę podać adres email",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      toast({
        title: "Sukces",
        description: "Instrukcje resetowania hasła zostały wysłane na podany adres email"
      });
      setEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił problem z wysłaniem instrukcji resetowania hasła",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl">Przypomnij hasło</CardTitle>
              <CardDescription>
                Podaj swój adres email, aby otrzymać instrukcje resetowania hasła
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="przyklad@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij instrukcje"}
                </Button>
                
                <div className="text-center text-sm">
                  Pamiętasz hasło?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Wróć do logowania
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
