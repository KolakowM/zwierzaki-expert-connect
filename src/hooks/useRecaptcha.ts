import { useState, useEffect, useCallback } from 'react';

interface RecaptchaConfig {
  siteKey?: string; // Made optional since we'll get it from window
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
    let retryCount = 0;
    const maxRetries = 50; // Max 5 seconds of retries
    
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha && window.RECAPTCHA_SITE_KEY) {
        window.grecaptcha.ready(() => {
          setIsReady(true);
        });
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(loadRecaptcha, 100);
      } else {
        setError('reCAPTCHA nie mogła zostać załadowana w wymaganym czasie');
      }
    };

    loadRecaptcha();
  }, []);

  const executeRecaptcha = useCallback(async (): Promise<string> => {
    if (!isReady || !window.grecaptcha || !window.RECAPTCHA_SITE_KEY) {
      throw new Error('reCAPTCHA nie jest gotowe');
    }

    try {
      const token = await window.grecaptcha.execute(window.RECAPTCHA_SITE_KEY, { 
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
  }, [isReady, config.action]);

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
    RECAPTCHA_SITE_KEY: string;
  }
}