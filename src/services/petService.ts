
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
