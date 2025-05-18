
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const getClients = async (): Promise<Client[]> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) return [];
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', authUser.user.id);
      
    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getClients:", error);
    return [];
  }
};

export const createClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) throw new Error("User not authenticated");
    
    const newClient = {
      ...client,
      user_id: authUser.user.id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('clients')
      .insert([newClient])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};
