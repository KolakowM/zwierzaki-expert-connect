
import { AuthError } from "@supabase/supabase-js";

export const getAuthErrorMessage = (error: AuthError | Error, t: (key: string, options?: any) => string): string => {
  const errorMessage = error.message.toLowerCase();
  
  // Handle specific Supabase auth errors
  if (errorMessage.includes('invalid login credentials') || 
      errorMessage.includes('invalid email or password')) {
    return t('auth.errors.invalid_credentials');
  }
  
  if (errorMessage.includes('email not confirmed')) {
    return t('auth.errors.email_not_confirmed');
  }
  
  if (errorMessage.includes('user already registered')) {
    return t('auth.errors.user_already_exists');
  }
  
  if (errorMessage.includes('password should be at least')) {
    return t('auth.errors.password_too_short');
  }
  
  if (errorMessage.includes('invalid email')) {
    return t('auth.errors.invalid_email');
  }
  
  if (errorMessage.includes('email rate limit exceeded')) {
    return t('auth.errors.rate_limit_exceeded');
  }
  
  if (errorMessage.includes('signup is disabled')) {
    return t('auth.errors.signup_disabled');
  }
  
  if (errorMessage.includes('password is too weak')) {
    return t('auth.errors.password_too_weak');
  }
  
  if (errorMessage.includes('same password') || 
      errorMessage.includes('new password should be different')) {
    return 'Nowe hasło musi być różne od poprzedniego hasła';
  }
  
  if (errorMessage.includes('session not found') || 
      errorMessage.includes('refresh_token_not_found')) {
    return 'Sesja wygasła. Proszę ponownie zresetować hasło';
  }
  
  // Generic fallback
  return t('auth.errors.generic_error');
};
