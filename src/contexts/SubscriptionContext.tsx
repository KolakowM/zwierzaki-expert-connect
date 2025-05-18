
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: Date | null;
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  subscriptionTier: null,
  subscriptionEnd: null,
  isLoading: false,
  error: null,
  refreshSubscription: async () => {},
  openCustomerPortal: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscription = async () => {
    if (!isAuthenticated) {
      setIsSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) {
        throw error;
      }

      if (data) {
        setIsSubscribed(data.subscribed || false);
        setSubscriptionTier(data.subscription_tier || null);
        setSubscriptionEnd(data.subscription_end ? new Date(data.subscription_end) : null);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError('Failed to check subscription status');
      setIsSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        throw error;
      }

      if (data && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Error opening customer portal:', err);
      setError('Failed to open customer portal');
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription on authentication change
  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscription();
    } else {
      setIsSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
    }
  }, [isAuthenticated]);

  // Check if payment was just completed
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('checkout_success') === 'true') {
      refreshSubscription();
    }
  }, []);

  const value = {
    isSubscribed,
    subscriptionTier,
    subscriptionEnd,
    isLoading,
    error,
    refreshSubscription,
    openCustomerPortal
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
