
import { supabase } from "@/integrations/supabase/client";
import { Package, UserSubscription, ActiveSubscription, PackageLimits, UsageStats, ActionType } from "@/types/subscription";

export const getActivePackages = async (): Promise<Package[]> => {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price_pln', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getUserActiveSubscription = async (userId: string): Promise<ActiveSubscription | null> => {
  const { data, error } = await supabase.rpc('get_user_active_subscription', {
    p_user_id: userId
  });

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
};

export const checkPackageLimits = async (userId: string, actionType: ActionType): Promise<PackageLimits | null> => {
  const { data, error } = await supabase.rpc('check_package_limits', {
    p_user_id: userId,
    p_action_type: actionType
  });

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
};

export const getUserUsageStats = async (userId: string): Promise<UsageStats | null> => {
  const { data, error } = await supabase.rpc('get_user_usage_stats', {
    p_user_id: userId
  });

  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
};

export const getUserSubscriptions = async (userId: string): Promise<UserSubscription[]> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(item => ({
    ...item,
    status: item.status as 'trial' | 'active' | 'expired' | 'cancelled'
  }));
};

export const createUserSubscription = async (subscription: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<UserSubscription> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    status: data.status as 'trial' | 'active' | 'expired' | 'cancelled'
  };
};

export const updateUserSubscription = async (id: string, updates: Partial<UserSubscription>): Promise<UserSubscription> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    status: data.status as 'trial' | 'active' | 'expired' | 'cancelled'
  };
};

// Nowe funkcje dla upgrade/downgrade
export const upgradeSubscription = async (userId: string, newPackageId: string): Promise<UserSubscription> => {
  // Najpierw sprawdź czy użytkownik ma aktywną subskrypcję
  const activeSubscription = await getUserActiveSubscription(userId);
  
  if (activeSubscription) {
    // Zaktualizuj istniejącą subskrypcję
    return updateUserSubscription(activeSubscription.subscription_id, {
      package_id: newPackageId,
      status: 'active',
      updated_at: new Date().toISOString()
    });
  } else {
    // Utwórz nową subskrypcję
    return createUserSubscription({
      user_id: userId,
      package_id: newPackageId,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: null // Dla subskrypcji bez określonego czasu końca
    });
  }
};

export const cancelSubscription = async (subscriptionId: string): Promise<UserSubscription> => {
  return updateUserSubscription(subscriptionId, {
    status: 'cancelled',
    updated_at: new Date().toISOString()
  });
};

export const validatePackageUpgrade = async (userId: string, currentPackageId: string, targetPackageId: string): Promise<{
  canUpgrade: boolean;
  issues: string[];
}> => {
  const issues: string[] = [];
  const usageStats = await getUserUsageStats(userId);
  
  if (!usageStats) {
    return { canUpgrade: false, issues: ['Nie można pobrać statystyk użycia'] };
  }

  // Pobierz pakiet docelowy
  const { data: targetPackage, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', targetPackageId)
    .single();

  if (error || !targetPackage) {
    issues.push('Nie można znaleźć pakietu docelowego');
    return { canUpgrade: false, issues };
  }

  // Sprawdź czy obecne użycie mieści się w nowych limitach
  if (usageStats.clients_count > targetPackage.max_clients) {
    issues.push(`Masz ${usageStats.clients_count} klientów, a nowy pakiet pozwala na ${targetPackage.max_clients}`);
  }
  
  if (usageStats.pets_count > targetPackage.max_pets) {
    issues.push(`Masz ${usageStats.pets_count} zwierząt, a nowy pakiet pozwala na ${targetPackage.max_pets}`);
  }
  
  if (usageStats.services_count > targetPackage.max_services) {
    issues.push(`Masz ${usageStats.services_count} usług, a nowy pakiet pozwala na ${targetPackage.max_services}`);
  }
  
  if (usageStats.specializations_count > targetPackage.max_specializations) {
    issues.push(`Masz ${usageStats.specializations_count} specjalizacji, a nowy pakiet pozwala na ${targetPackage.max_specializations}`);
  }

  return { canUpgrade: issues.length === 0, issues };
};
