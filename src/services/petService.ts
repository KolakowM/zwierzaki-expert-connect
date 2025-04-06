
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/types";

export const getPets = async (): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
  
  return data || [];
};

export const getPetsByClientId = async (clientId: string): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('clientId', clientId)
    .order('name');
  
  if (error) {
    console.error(`Error fetching pets for client ${clientId}:`, error);
    throw error;
  }
  
  return data || [];
};

export const getPetById = async (id: string): Promise<Pet | null> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching pet with id ${id}:`, error);
    return null;
  }
  
  return data;
};

export const createPet = async (pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> => {
  const { data, error } = await supabase
    .from('pets')
    .insert([pet])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating pet:', error);
    throw error;
  }
  
  return data;
};

export const updatePet = async (id: string, pet: Partial<Pet>): Promise<Pet> => {
  const { data, error } = await supabase
    .from('pets')
    .update(pet)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating pet with id ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deletePet = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting pet with id ${id}:`, error);
    throw error;
  }
};
