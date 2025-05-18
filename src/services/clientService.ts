
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
    
    return data;
  } catch (error) {
    console.error("Error in getClientById:", error);
    return null;
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

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
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

export const getRelatedEntitiesCount = async (clientId: string): Promise<{
  petsCount: number;
  visitsCount: number;
  careProgramsCount: number;
}> => {
  try {
    // Get count of related pets
    const { count: petsCount, error: petsError } = await supabase
      .from('pets')
      .select('*', { count: 'exact', head: true })
      .eq('clientid', clientId);
      
    if (petsError) throw petsError;
      
    // Get count of related visits
    const { count: visitsCount, error: visitsError } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('clientid', clientId);
      
    if (visitsError) throw visitsError;
      
    // Get count of related care programs
    const { data: pets } = await supabase
      .from('pets')
      .select('id')
      .eq('clientid', clientId);
      
    const petIds = pets?.map(pet => pet.id) || [];
    
    let careProgramsCount = 0;
    if (petIds.length > 0) {
      const { count, error } = await supabase
        .from('care_programs')
        .select('*', { count: 'exact', head: true })
        .in('petid', petIds);
        
      if (error) throw error;
      careProgramsCount = count || 0;
    }
    
    return {
      petsCount: petsCount || 0,
      visitsCount: visitsCount || 0,
      careProgramsCount
    };
  } catch (error) {
    console.error("Error getting related entities count:", error);
    return { petsCount: 0, visitsCount: 0, careProgramsCount: 0 };
  }
};
