
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  getUserActiveSubscription, 
  getUserUsageStats, 
  createUserSubscription,
  updateUserSubscription 
} from '@/services/subscriptionService';
import { ActiveSubscription, UsageStats, UserSubscription } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';

export const useUserSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: activeSubscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError
  } = useQuery({
    queryKey: ['activeSubscription', user?.id],
    queryFn: () => getUserActiveSubscription(user!.id),
    enabled: !!user?.id,
  });

  const {
    data: usageStats,
    isLoading: isLoadingUsage,
    error: usageError
  } = useQuery({
    queryKey: ['usageStats', user?.id],
    queryFn: () => getUserUsageStats(user!.id),
    enabled: !!user?.id,
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: (subscription: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>) => 
      createUserSubscription(subscription),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['usageStats'] });
      toast({
        title: "Subskrypcja utworzona",
        description: "Twoja subskrypcja została pomyślnie utworzona",
      });
    },
    onError: (error) => {
      console.error('Error creating subscription:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się utworzyć subskrypcji",
        variant: "destructive",
      });
    }
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UserSubscription> }) => 
      updateUserSubscription(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSubscription'] });
      toast({
        title: "Subskrypcja zaktualizowana",
        description: "Twoja subskrypcja została pomyślnie zaktualizowana",
      });
    },
    onError: (error) => {
      console.error('Error updating subscription:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować subskrypcji",
        variant: "destructive",
      });
    }
  });

  const isTrialUser = !activeSubscription;
  const isSubscriptionExpired = activeSubscription?.end_date && new Date(activeSubscription.end_date) <= new Date();

  return {
    activeSubscription,
    usageStats,
    isLoadingSubscription,
    isLoadingUsage,
    subscriptionError,
    usageError,
    isTrialUser,
    isSubscriptionExpired,
    createSubscription: createSubscriptionMutation.mutate,
    updateSubscription: updateSubscriptionMutation.mutate,
    isCreatingSubscription: createSubscriptionMutation.isPending,
    isUpdatingSubscription: updateSubscriptionMutation.isPending,
  };
};
