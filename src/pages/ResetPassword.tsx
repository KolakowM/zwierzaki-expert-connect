
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { updatePassword } from "@/services/authService";
import { useAuth } from "@/contexts/AuthProvider";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import PasswordRequirements, { validatePassword } from "@/components/auth/PasswordRequirements";
import { getAuthErrorMessage } from "@/utils/authErrorHandler";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifySession } = useAuth();
  
  const passwordValidation = validatePassword(password);
  // Check if the user has a valid reset token
  useEffect(() => {
    const checkResetToken = async () => {
      try {
        // Verify if user has a valid session from the reset link
        const isValid = await verifySession();
        setIsValidToken(isValid);
        
        if (!isValid) {
          // Check URL parameters for error codes
          const error = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          if (error === 'access_denied' || errorDescription?.includes('expired')) {
            setError("Link resetowania hasła wygasł lub jest nieprawidłowy");
          } else {
            setError("Nieprawidłowy link resetowania hasła");
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setIsValidToken(false);
        setError("Wystąpił problem z weryfikacją linku resetowania hasła");
      }
    };

    checkResetToken();
  }, [verifySession, searchParams]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!passwordValidation.isValid) {
      setError("Hasło nie spełnia wymagań bezpieczeństwa");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updatePassword(password);
      setIsPasswordChanged(true);
      toast({
        title: "Sukces",
        description: "Twoje hasło zostało pomyślnie zmienione"
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      if (error.message?.includes('same password') || error.message?.includes('New password should be different')) {
        setError("Nowe hasło musi być różne od poprzedniego hasła");
      } else {
        setError(getAuthErrorMessage(error, t));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking token validity
  if (isValidToken === null) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
          <div className="w-full max-w-md">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Sprawdzanie linku resetowania hasła...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state for invalid token
  if (isValidToken === false) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-2xl">Link nieważny</CardTitle>
                <CardDescription>
                  {error || "Link resetowania hasła jest nieprawidłowy lub wygasł"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Możliwe przyczyny:</strong><br />
                    • Link wygasł (ważny przez 1 godzinę)<br />
                    • Link został już użyty<br />
                    • Link jest nieprawidłowy
                  </AlertDescription>
                </Alert>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Link to="/forgot-password" className="w-full">
                  <Button className="w-full">
                    Wyślij nowy link resetowania
                  </Button>
                </Link>
                
                <Link to="/login" className="text-center text-sm text-primary hover:underline">
                  Wróć do logowania
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show success state after password change
  if (isPasswordChanged) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Hasło zostało zmienione</CardTitle>
                <CardDescription>
                  Twoje hasło zostało pomyślnie zaktualizowane
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Hasło zostało zmienione</strong><br />
                    Możesz teraz zalogować się używając nowego hasła
                  </AlertDescription>
                </Alert>
              </CardContent>
              
              <CardFooter>
                <Button onClick={() => navigate("/login")} className="w-full">
                  Przejdź do logowania
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show reset password form
  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl">Ustaw nowe hasło</CardTitle>
              <CardDescription>
                Wprowadź nowe, bezpieczne hasło do swojego konta
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Nowe hasło</Label>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <PasswordRequirements 
                    password={password} 
                    showRequirements={password.length > 0}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Powtórz nowe hasło</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-600">Hasła nie są identyczne</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !passwordValidation.isValid || password !== confirmPassword}
                >
                  {isSubmitting ? "Aktualizowanie..." : "Ustaw nowe hasło"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPassword;
