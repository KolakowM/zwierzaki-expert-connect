
import { Pet } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const getPets = async (): Promise<Pet[]> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) return [];
    
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', authUser.user.id);
      
    if (error) {
      console.error("Error fetching pets:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getPets:", error);
    return [];
  }
};

export const getPetById = async (petId: string): Promise<Pet | null> => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .single();
      
    if (error) {
      console.error("Error fetching pet by id:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getPetById:", error);
    return null;
  }
};

export const getPetsByClientId = async (clientId: string): Promise<Pet[]> => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('clientid', clientId);
      
    if (error) {
      console.error("Error fetching pets by client id:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getPetsByClientId:", error);
    return [];
  }
};

export const createPet = async (pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) throw new Error("User not authenticated");
    
    const newPet = {
      ...pet,
      user_id: authUser.user.id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('pets')
      .insert([newPet])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating pet:", error);
    throw error;
  }
};

export const updatePet = async (id: string, pet: Partial<Pet>): Promise<Pet> => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .update(pet)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error updating pet:", error);
    throw error;
  }
};

export const deletePet = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting pet:", error);
    throw error;
  }
};
