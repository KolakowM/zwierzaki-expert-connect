
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PasswordRequirementsProps {
  password: string;
  showRequirements?: boolean;
}

export interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export const validatePassword = (password: string): PasswordValidation => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
  };
};

const PasswordRequirements = ({ password, showRequirements = true }: PasswordRequirementsProps) => {
  const { t } = useTranslation();
  const validation = validatePassword(password);

  if (!showRequirements) return null;

  const requirements = [
    { key: 'min_length', valid: validation.hasMinLength },
    { key: 'uppercase', valid: validation.hasUppercase },
    { key: 'lowercase', valid: validation.hasLowercase },
    { key: 'number', valid: validation.hasNumber },
    { key: 'special_char', valid: validation.hasSpecialChar },
  ];

  return (
    <div className="mt-2 space-y-1">
      <p className="text-sm font-medium text-gray-700">
        {t('auth.password_requirements')}:
      </p>
      <ul className="space-y-1">
        {requirements.map((req) => (
          <li key={req.key} className="flex items-center gap-2 text-xs">
            {req.valid ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-red-500" />
            )}
            <span className={req.valid ? "text-green-700" : "text-red-700"}>
              {t(`auth.password_${req.key}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
