
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
  return data || [];
};

export const createUserSubscription = async (subscription: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<UserSubscription> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserSubscription = async (id: string, updates: Partial<UserSubscription>): Promise<UserSubscription> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
