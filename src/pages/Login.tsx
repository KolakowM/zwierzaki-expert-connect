
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInCredentials } from "@/services/authService";
import { useTranslation } from "react-i18next";
import { CardContent, CardFooter } from "@/components/ui/card";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import AuthFormError from "@/components/auth/AuthFormError";
import AuthLoadingScreen from "@/components/auth/AuthLoadingScreen";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Fix: Call login with email and password directly instead of credentials object
      const result = await login(email, password);
      
      if (result !== true && result?.error) {
        setError(result.error);
      }
      // No need to redirect here - onAuthStateChange handles that
    } catch (err: any) {
      setError(err.message || "Błąd logowania. Sprawdź dane i spróbuj ponownie.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading screen while authentication state is being verified
  if (authLoading) {
    console.log("Login: showing loading screen");
    return <AuthLoadingScreen />;
  }
  
  // Redirect to dashboard if user is already authenticated
  if (isAuthenticated) {
    console.log("Login: user is authenticated, redirecting to:", from);
    return <Navigate to={from} replace />;
  }

  return (
    <AuthFormWrapper
      title={t('auth.login_title')}
      description={t('auth.login_description')}
    >
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <AuthFormError error={error} />
          
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                {t('auth.forgot_password')}
              </Link>
            </div>
            <Input 
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('auth.login_title')}
          </Button>
          
          <div className="text-center text-sm">
            {t('auth.no_account')}{" "}
            <Link to="/register" className="text-primary hover:underline">
              {t('auth.register')}
            </Link>
          </div>
        </CardFooter>
      </form>
    </AuthFormWrapper>
  );
};

export default Login;
