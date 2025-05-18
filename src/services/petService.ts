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
    
    // Convert camelCase to snake_case for database
    const newPet = {
      name: pet.name,
      species: pet.species,
      clientid: pet.clientId,
      breed: pet.breed,
      age: pet.age ? Number(pet.age) : null,
      weight: pet.weight ? Number(pet.weight) : null,
      sex: pet.sex,
      neutered: pet.neutered,
      medicalhistory: pet.medicalHistory,
      allergies: pet.allergies,
      dietaryrestrictions: pet.dietaryRestrictions,
      behavioralnotes: pet.behavioralNotes,
      has_microchip: pet.hasMicrochip || false,
      microchip_number: pet.microchipNumber,
      vaccination_description: pet.vaccinationDescription,
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
    // Convert camelCase to snake_case for database
    const updateData: any = {};
    
    if (pet.name) updateData.name = pet.name;
    if (pet.species) updateData.species = pet.species;
    if (pet.clientId) updateData.clientid = pet.clientId;
    if (pet.breed) updateData.breed = pet.breed;
    if (pet.age !== undefined) updateData.age = pet.age;
    if (pet.weight !== undefined) updateData.weight = pet.weight;
    if (pet.sex) updateData.sex = pet.sex;
    if (pet.neutered !== undefined) updateData.neutered = pet.neutered;
    if (pet.medicalHistory) updateData.medicalhistory = pet.medicalHistory;
    if (pet.allergies) updateData.allergies = pet.allergies;
    if (pet.dietaryRestrictions) updateData.dietaryrestrictions = pet.dietaryRestrictions;
    if (pet.behavioralNotes) updateData.behavioralnotes = pet.behavioralNotes;
    if (pet.hasMicrochip !== undefined) updateData.has_microchip = pet.hasMicrochip;
    if (pet.microchipNumber) updateData.microchip_number = pet.microchipNumber;
    if (pet.vaccinationDescription) updateData.vaccination_description = pet.vaccinationDescription;
    
    const { data, error } = await supabase
      .from('pets')
      .update(updateData)
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

// Add the missing function for counting related entities
export const getRelatedEntitiesCount = async (petId: string): Promise<{ visits: number, carePrograms: number }> => {
  try {
    const [visitsResult, programsResult] = await Promise.all([
      supabase.from('visits').select('id', { count: 'exact' }).eq('petid', petId),
      supabase.from('care_programs').select('id', { count: 'exact' }).eq('petid', petId)
    ]);
    
    return {
      visits: visitsResult.count || 0,
      carePrograms: programsResult.count || 0
    };
  } catch (error) {
    console.error("Error counting related entities:", error);
    return { visits: 0, carePrograms: 0 };
  }
};
