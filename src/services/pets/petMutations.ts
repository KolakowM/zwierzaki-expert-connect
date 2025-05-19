
import { Pet } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbPetToPet, mapPetToDbPet } from "./mappers";

export const createPet = async (pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> => {
  try {
    // Ensure required fields are provided
    if (!pet.name) throw new Error("Pet name is required");
    if (!pet.species) throw new Error("Pet species is required");
    if (!pet.clientId) throw new Error("Client ID is required");
    
    const dbPet = mapPetToDbPet(pet);
    
    const { data, error } = await supabase
      .from('pets')
      .insert([dbPet])
      .select()
      .single();
      
    if (error) throw error;
    
    return mapDbPetToPet(data);
  } catch (error) {
    console.error("Error creating pet:", error);
    throw error;
  }
};

export const updatePet = async (id: string, pet: Partial<Pet>): Promise<Pet> => {
  try {
    const dbPet = mapPetToDbPet(pet);
    
    const { data, error } = await supabase
      .from('pets')
      .update(dbPet)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapDbPetToPet(data);
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
