
import { supabase } from "@/integrations/supabase/client";
import { Addon, UserAddon, EffectiveLimits } from "@/types/addon";

export const getActiveAddons = async (): Promise<Addon[]> => {
  const { data, error } = await supabase
    .from('addons')
    .select('*')
    .eq('is_active', true)
    .order('addon_type', { ascending: true })
    .order('limit_increase', { ascending: true });
  
  if (error) {
    console.error('Error fetching active addons:', error);
    throw error;
  }
  
  return data || [];
};

export const getUserAddons = async (userId: string): Promise<UserAddon[]> => {
  const { data, error } = await supabase
    .from('user_addons')
    .select(`
      *,
      addon:addons(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user addons:', error);
    throw error;
  }
  
  return data || [];
};

export const getUserEffectiveLimits = async (userId: string): Promise<EffectiveLimits | null> => {
  const { data, error } = await supabase
    .rpc('get_user_effective_limits', { p_user_id: userId });
  
  if (error) {
    console.error('Error fetching effective limits:', error);
    throw error;
  }
  
  return data?.[0] || null;
};

export const purchaseAddon = async (addonId: string, quantity: number = 1): Promise<UserAddon> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_addons')
    .insert([{
      user_id: user.id,
      addon_id: addonId,
      quantity: quantity,
      status: 'active'
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error purchasing addon:', error);
    throw error;
  }
  
  return data;
};

export const updateAddonQuantity = async (userAddonId: string, newQuantity: number): Promise<UserAddon> => {
  const { data, error } = await supabase
    .from('user_addons')
    .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
    .eq('id', userAddonId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating addon quantity:', error);
    throw error;
  }
  
  return data;
};

export const cancelAddon = async (userAddonId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_addons')
    .update({ 
      status: 'cancelled', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', userAddonId);
  
  if (error) {
    console.error('Error cancelling addon:', error);
    throw error;
  }
};
