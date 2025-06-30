
import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { CardContent, CardFooter } from "@/components/ui/card";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import AuthFormError from "@/components/auth/AuthFormError";
import AuthLoadingScreen from "@/components/auth/AuthLoadingScreen";
import PasswordRequirements, { validatePassword } from "@/components/auth/PasswordRequirements";
import RegistrationSuccess from "@/components/auth/RegistrationSuccess";
import { getAuthErrorMessage } from "@/utils/authErrorHandler";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const passwordValidation = validatePassword(formData.password);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate password requirements
    if (!passwordValidation.isValid) {
      setError(t('auth.errors.password_requirements_not_met'));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.errors.passwords_not_match'));
      return;
    }
    
    if (!acceptedTerms) {
      setError(t('auth.errors.terms_not_accepted'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register(
        formData.email, 
        formData.password,
        formData.firstName,
        formData.lastName
      );
      
      if (result === true) {
        setRegisteredEmail(formData.email);
        setShowSuccess(true);
        toast({
          title: t("auth.register_success"),
          description: t("auth.register_welcome"),
        });
      } else if (result?.error) {
        setError(getAuthErrorMessage(result.error, t));
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(getAuthErrorMessage(err, t));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading screen while authentication state is being verified
  if (authLoading) {
    return <AuthLoadingScreen />;
  }
  
  // Redirect to dashboard if user is already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show success screen after registration
  if (showSuccess) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
        <RegistrationSuccess
          email={registeredEmail}
          onBackToLogin={() => setShowSuccess(false)}
        />
      </div>
    );
  }

  return (
    <AuthFormWrapper
      title={t('auth.register_title')}
      description={t('auth.register_description')}
    >
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <AuthFormError error={error} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('auth.first_name')}</Label>
              <Input 
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('auth.last_name')}</Label>
              <Input 
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              placeholder="przyklad@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input 
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordRequirements 
              password={formData.password} 
              showRequirements={formData.password.length > 0}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
            <Input 
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              i{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                {t('auth.privacy_policy')}
              </Link>
            </label>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !passwordValidation.isValid}
          >
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
    </AuthFormWrapper>
  );
};

export default Register;
