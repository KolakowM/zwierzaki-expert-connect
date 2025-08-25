
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
import { CheckCircle, Mail, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
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
      setSentEmail(email);
      setEmailSent(true);
      toast({
        title: "Email wysłany",
        description: "Sprawdź swoją skrzynkę pocztową i postępuj zgodnie z instrukcjami"
      });
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

  if (emailSent) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Email został wysłany</CardTitle>
                <CardDescription>
                  Instrukcje resetowania hasła zostały wysłane na adres <strong>{sentEmail}</strong>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Sprawdź swoją skrzynkę pocztową</strong><br />
                    Kliknij link w otrzymanym emailu, aby ustawić nowe hasło
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Link wygasa po 1 godzinie</strong><br />
                    Jeśli nie otrzymasz emaila w ciągu kilku minut, sprawdź folder spam
                  </AlertDescription>
                </Alert>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }} 
                  variant="outline" 
                  className="w-full"
                >
                  Wyślij ponownie na inny adres
                </Button>
                
                <div className="text-center text-sm">
                  <Link to="/login" className="text-primary hover:underline">
                    Wróć do logowania
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

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
