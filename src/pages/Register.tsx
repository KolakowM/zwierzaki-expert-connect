
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SignUpCredentials } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  
  const { register, isAuthenticated, verifySession } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // On component mount, verify the session explicitly
  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifySession();
      setAuthenticated(isValid);
      
      if (isValid) {
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [verifySession, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }
    
    if (!acceptedTerms) {
      setError("Musisz zaakceptować regulamin");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const credentials: SignUpCredentials = {
        email,
        password,
        firstName,
        lastName
      };
      
      await register(credentials);
      
      toast({
        title: t("auth.register_success"),
        description: t("auth.register_welcome"),
      });
    } catch (err: any) {
      setError(err.message || "Błąd rejestracji. Spróbuj ponownie później.");
      toast({
        title: "Błąd rejestracji",
        description: err.message || "Nie udało się utworzyć konta. Spróbuj ponownie później.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // If checking authentication status, show loading
  if (authenticated === null) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  // If already logged in, redirect to dashboard
  if (authenticated || isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl">{t('auth.register_title')}</CardTitle>
              <CardDescription>{t('auth.register_description')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">{error}</div>}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('auth.first_name')}</Label>
                    <Input 
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('auth.last_name')}</Label>
                    <Input 
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
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
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  />
                  <label htmlFor="terms" className="text-sm">
                    {t('auth.accept_terms')}{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      {t('auth.terms')}
                    </Link>{" "}
                    {t('common.and')}{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      {t('auth.privacy_policy')}
                    </Link>
                  </label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('common.loading') : t('auth.register_title')}
                </Button>
                
                <div className="text-center text-sm">
                  {t('auth.have_account')}{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    {t('auth.login_title')}
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

export default Register;
