
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SignInCredentials } from "@/services/authService";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  
  const { login, isAuthenticated, verifySession } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // On component mount, verify the session explicitly
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await verifySession();
        setAuthenticated(isValid);
        
        if (isValid) {
          navigate('/dashboard');
        }
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [verifySession, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const credentials: SignInCredentials = { email, password };
      await login(credentials);
    } catch (err: any) {
      setError(err.message || "Błąd logowania. Sprawdź dane i spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // If still checking authentication status, show loading
  if (!authChecked) {
    return (
      <MainLayout>
        <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  // Only redirect if we've confirmed authentication
  if (authenticated && authChecked) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)] py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl">{t('auth.login_title')}</CardTitle>
              <CardDescription>{t('auth.login_description')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">{error}</div>}
                
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
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
