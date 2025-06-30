
import { CheckCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RegistrationSuccessProps {
  email: string;
  onResendEmail?: () => void;
  onBackToLogin: () => void;
}

const RegistrationSuccess = ({ email, onResendEmail, onBackToLogin }: RegistrationSuccessProps) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {t('auth.registration_success_title')}
          </h1>
          <p className="text-muted-foreground">
            {t('auth.registration_success_description')}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <Mail className="h-5 w-5" />
            <span className="font-medium">{t('auth.check_email_title')}</span>
          </div>
          <p className="text-sm text-blue-600">
            {t('auth.check_email_description', { email })}
          </p>
        </div>

        <div className="space-y-3">
          {onResendEmail && (
            <Button
              variant="outline"
              onClick={onResendEmail}
              className="w-full"
            >
              {t('auth.resend_email')}
            </Button>
          )}
          
          <Button
            onClick={onBackToLogin}
            className="w-full"
          >
            {t('auth.back_to_login')}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {t('auth.email_not_received')}
        </p>
      </CardContent>
    </Card>
  );
};

export default RegistrationSuccess;
