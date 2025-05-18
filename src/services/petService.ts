
import { Pet } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Helper function to map database pet to Pet type
export function mapDbPetToPet(dbPet: any): Pet {
  return {
    id: dbPet.id,
    name: dbPet.name,
    species: dbPet.species,
    breed: dbPet.breed || "",
    age: dbPet.age || 0,
    weight: dbPet.weight || 0,
    sex: dbPet.sex || "",
    neutered: dbPet.neutered || false,
    clientId: dbPet.clientid || dbPet.clientId,
    medicalHistory: dbPet.medicalhistory || dbPet.medicalHistory || "",
    allergies: dbPet.allergies || "",
    dietaryRestrictions: dbPet.dietaryrestrictions || dbPet.dietaryRestrictions || "",
    behavioralNotes: dbPet.behavioralnotes || dbPet.behavioralNotes || "",
    hasMicrochip: dbPet.has_microchip || dbPet.hasMicrochip || false,
    microchipNumber: dbPet.microchip_number || dbPet.microchipNumber || "",
    vaccinationDescription: dbPet.vaccination_description || dbPet.vaccinationDescription || "",
    createdAt: dbPet.createdat || dbPet.created_at || new Date().toISOString(),
    user_id: dbPet.user_id
  };
}

// Helper function to map Pet type to database format
export function mapPetToDbPet(pet: Partial<Pet>): any {
  const dbPet: any = {};
  
  if (pet.name !== undefined) dbPet.name = pet.name;
  if (pet.species !== undefined) dbPet.species = pet.species;
  if (pet.breed !== undefined) dbPet.breed = pet.breed;
  if (pet.age !== undefined) dbPet.age = pet.age;
  if (pet.weight !== undefined) dbPet.weight = pet.weight;
  if (pet.sex !== undefined) dbPet.sex = pet.sex;
  if (pet.neutered !== undefined) dbPet.neutered = pet.neutered;
  if (pet.clientId !== undefined) dbPet.clientid = pet.clientId;
  if (pet.medicalHistory !== undefined) dbPet.medicalhistory = pet.medicalHistory;
  if (pet.allergies !== undefined) dbPet.allergies = pet.allergies;
  if (pet.dietaryRestrictions !== undefined) dbPet.dietaryrestrictions = pet.dietaryRestrictions;
  if (pet.behavioralNotes !== undefined) dbPet.behavioralnotes = pet.behavioralNotes;
  if (pet.hasMicrochip !== undefined) dbPet.has_microchip = pet.hasMicrochip;
  if (pet.microchipNumber !== undefined) dbPet.microchip_number = pet.microchipNumber;
  if (pet.vaccinationDescription !== undefined) dbPet.vaccination_description = pet.vaccinationDescription;
  if (pet.user_id !== undefined) dbPet.user_id = pet.user_id;
  
  return dbPet;
}

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
    
    return data ? data.map(mapDbPetToPet) : [];
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
    
    return data ? mapDbPetToPet(data) : null;
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
    
    return data ? data.map(mapDbPetToPet) : [];
  } catch (error) {
    console.error("Error in getPetsByClientId:", error);
    return [];
  }
};

export const createPet = async (pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) throw new Error("User not authenticated");
    
    const dbPet = mapPetToDbPet(pet);
    dbPet.user_id = authUser.user.id; // Always ensure user_id is set
    
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

export const getRelatedEntitiesCount = async (petId: string): Promise<{ visits: number, carePrograms: number }> => {
  try {
    const [visitsResult, careProgramsResult] = await Promise.all([
      supabase.from('visits').select('id', { count: 'exact' }).eq('petid', petId),
      supabase.from('care_programs').select('id', { count: 'exact' }).eq('petid', petId)
    ]);
    
    return {
      visits: visitsResult.count || 0,
      carePrograms: careProgramsResult.count || 0
    };
  } catch (error) {
    console.error("Error counting related entities:", error);
    return { visits: 0, carePrograms: 0 };
  }
};

export const getVisitsByPetId = async (petId: string) => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('petid', petId);
      
    if (error) {
      console.error("Error fetching visits by pet id:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getVisitsByPetId:", error);
    return [];
  }
};
