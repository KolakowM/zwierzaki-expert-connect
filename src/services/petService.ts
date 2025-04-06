
import { supabase } from "@/integrations/supabase/client";
import { Pet, DbPet, mapDbPetToPet, mapPetToDbPet } from "@/types";

export const getPets = async (): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('createdat', { ascending: false });
  
  if (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
  
  return (data || []).map(pet => mapDbPetToPet(pet as DbPet));
};

export const getPetsByClientId = async (clientId: string): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('clientid', clientId)
    .order('name');
  
  if (error) {
    console.error(`Error fetching pets for client ${clientId}:`, error);
    throw error;
  }
  
  return (data || []).map(pet => mapDbPetToPet(pet as DbPet));
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
  
  return data ? mapDbPetToPet(data as DbPet) : null;
};

export const createPet = async (pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> => {
  const dbPet = mapPetToDbPet(pet);
  
  const { data, error } = await supabase
    .from('pets')
    .insert([dbPet])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating pet:', error);
    throw error;
  }
  
  return mapDbPetToPet(data as DbPet);
};

export const updatePet = async (id: string, pet: Partial<Pet>): Promise<Pet> => {
  // Convert camelCase pet properties to snake_case for the database
  const dbPetUpdate: Partial<DbPet> = {};
  if (pet.clientId !== undefined) dbPetUpdate.clientid = pet.clientId;
  if (pet.name !== undefined) dbPetUpdate.name = pet.name;
  if (pet.species !== undefined) dbPetUpdate.species = pet.species;
  if (pet.breed !== undefined) dbPetUpdate.breed = pet.breed;
  if (pet.age !== undefined) dbPetUpdate.age = pet.age;
  if (pet.weight !== undefined) dbPetUpdate.weight = pet.weight;
  if (pet.sex !== undefined) dbPetUpdate.sex = pet.sex;
  if (pet.neutered !== undefined) dbPetUpdate.neutered = pet.neutered;
  if (pet.medicalHistory !== undefined) dbPetUpdate.medicalhistory = pet.medicalHistory;
  if (pet.allergies !== undefined) dbPetUpdate.allergies = pet.allergies;
  if (pet.dietaryRestrictions !== undefined) dbPetUpdate.dietaryrestrictions = pet.dietaryRestrictions;
  if (pet.behavioralNotes !== undefined) dbPetUpdate.behavioralnotes = pet.behavioralNotes;

  const { data, error } = await supabase
    .from('pets')
    .update(dbPetUpdate)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating pet with id ${id}:`, error);
    throw error;
  }
  
  return mapDbPetToPet(data as DbPet);
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
