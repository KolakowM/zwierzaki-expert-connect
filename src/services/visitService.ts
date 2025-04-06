
import { supabase } from "@/integrations/supabase/client";
import { Visit } from "@/types";

export const getVisits = async (): Promise<Visit[]> => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }
  
  return data as unknown as Visit[];
};

export const getVisitsByClientId = async (clientId: string): Promise<Visit[]> => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('clientId', clientId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching visits for client ${clientId}:`, error);
    throw error;
  }
  
  return data as unknown as Visit[];
};

export const getVisitsByPetId = async (petId: string): Promise<Visit[]> => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('petId', petId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching visits for pet ${petId}:`, error);
    throw error;
  }
  
  return data as unknown as Visit[];
};

export const getVisitById = async (id: string): Promise<Visit | null> => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching visit with id ${id}:`, error);
    return null;
  }
  
  return data as unknown as Visit;
};

export const createVisit = async (visit: Omit<Visit, 'id'>): Promise<Visit> => {
  const { data, error } = await supabase
    .from('visits')
    .insert([visit])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
  
  return data as unknown as Visit;
};

export const updateVisit = async (id: string, visit: Partial<Visit>): Promise<Visit> => {
  const { data, error } = await supabase
    .from('visits')
    .update(visit)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating visit with id ${id}:`, error);
    throw error;
  }
  
  return data as unknown as Visit;
};

export const deleteVisit = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting visit with id ${id}:`, error);
    throw error;
  }
};
