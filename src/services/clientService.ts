
import { Client } from "@/types";
import { mapDbClientToClient, mapClientToDbClient } from "@/types";
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
    
    return data ? data.map(mapDbClientToClient) : [];
  } catch (error) {
    console.error("Error in getClients:", error);
    return [];
  }
};

export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (error) {
      console.error("Error fetching client by id:", error);
      return null;
    }
    
    return data ? mapDbClientToClient(data) : null;
  } catch (error) {
    console.error("Error in getClientById:", error);
    return null;
  }
};

export const createClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) throw new Error("User not authenticated");
    
    const dbClient = mapClientToDbClient(client);
    dbClient.user_id = authUser.user.id; // Always ensure user_id is set
    
    const { data, error } = await supabase
      .from('clients')
      .insert([dbClient])
      .select()
      .single();
      
    if (error) throw error;
    
    return mapDbClientToClient(data);
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  try {
    const dbClient = mapClientToDbClient(client);
    
    const { data, error } = await supabase
      .from('clients')
      .update(dbClient)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapDbClientToClient(data);
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

export const getRelatedEntitiesCount = async (clientId: string): Promise<{ pets: number, visits: number }> => {
  try {
    const [petsResult, visitsResult] = await Promise.all([
      supabase.from('pets').select('id', { count: 'exact' }).eq('clientid', clientId),
      supabase.from('visits').select('id', { count: 'exact' }).eq('clientid', clientId)
    ]);
    
    return {
      pets: petsResult.count || 0,
      visits: visitsResult.count || 0
    };
  } catch (error) {
    console.error("Error counting related entities:", error);
    return { pets: 0, visits: 0 };
  }
};
