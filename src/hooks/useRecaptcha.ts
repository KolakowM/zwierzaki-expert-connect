import { useState, useEffect, useCallback } from 'react';

interface RecaptchaConfig {
  siteKey: string;
  action: string;
}

interface UseRecaptchaReturn {
  executeRecaptcha: () => Promise<string>;
  isReady: boolean;
  error: string | null;
}

export const useRecaptcha = (config: RecaptchaConfig): UseRecaptchaReturn => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsReady(true);
        });
      } else {
        // Retry after a short delay if grecaptcha is not available yet
        setTimeout(loadRecaptcha, 100);
      }
    };

    loadRecaptcha();
  }, []);

  const executeRecaptcha = useCallback(async (): Promise<string> => {
    if (!isReady || !window.grecaptcha) {
      throw new Error('reCAPTCHA nie jest gotowe');
    }

    try {
      const token = await window.grecaptcha.execute(config.siteKey, { 
        action: config.action 
      });
      
      if (!token) {
        throw new Error('Nie udało się uzyskać tokenu reCAPTCHA');
      }
      
      return token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Błąd reCAPTCHA';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isReady, config.siteKey, config.action]);

  return {
    executeRecaptcha,
    isReady,
    error
  };
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}