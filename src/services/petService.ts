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
  // Convert pet data to database format with proper type handling
  const dbPetUpdate: Partial<DbPet> = {};
  
  if (pet.clientId !== undefined) dbPetUpdate.clientid = pet.clientId;
  if (pet.name !== undefined) dbPetUpdate.name = pet.name;
  if (pet.species !== undefined) dbPetUpdate.species = pet.species;
  if (pet.breed !== undefined) dbPetUpdate.breed = pet.breed;
  
  // Handle dateOfBirth conversion to YYYY-MM-DD format for database
  if (pet.dateOfBirth !== undefined) {
    dbPetUpdate.date_of_birth = pet.dateOfBirth ? 
      new Date(pet.dateOfBirth).toISOString().split('T')[0] : null;
  }
  
  // Keep age handling for backward compatibility
  if (pet.age !== undefined) {
    // If age is a string, convert to number and round to integer
    dbPetUpdate.age = typeof pet.age === 'string' 
      ? Math.round(Number(pet.age)) 
      : Math.round(pet.age);
  }
  
  // Ensure weight is properly handled as a decimal
  if (pet.weight !== undefined) {
    // Convert weight to a number (can be decimal)
    dbPetUpdate.weight = typeof pet.weight === 'string' 
      ? Number(pet.weight.replace(',', '.')) 
      : pet.weight;
  }
  
  if (pet.sex !== undefined) dbPetUpdate.sex = pet.sex;
  if (pet.neutered !== undefined) dbPetUpdate.neutered = pet.neutered;
  if (pet.medicalHistory !== undefined) dbPetUpdate.medicalhistory = pet.medicalHistory;
  if (pet.allergies !== undefined) dbPetUpdate.allergies = pet.allergies;
  if (pet.dietaryRestrictions !== undefined) dbPetUpdate.dietaryrestrictions = pet.dietaryRestrictions;
  if (pet.behavioralNotes !== undefined) dbPetUpdate.behavioralnotes = pet.behavioralNotes;
  if (pet.hasMicrochip !== undefined) dbPetUpdate.has_microchip = pet.hasMicrochip;
  if (pet.microchipNumber !== undefined) dbPetUpdate.microchip_number = pet.microchipNumber;
  if (pet.vaccinationDescription !== undefined) dbPetUpdate.vaccination_description = pet.vaccinationDescription;

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
  // 1. Usuń powiązane programy opieki
  const { error: careProgramsError } = await supabase
    .from('care_programs')
    .delete()
    .eq('petid', id);
  
  if (careProgramsError) {
    console.error(`Error deleting care programs for pet with id ${id}:`, careProgramsError);
    throw careProgramsError;
  }
  
  // 2. Usuń powiązane wizyty
  const { error: visitsError } = await supabase
    .from('visits')
    .delete()
    .eq('petid', id);
  
  if (visitsError) {
    console.error(`Error deleting visits for pet with id ${id}:`, visitsError);
    throw visitsError;
  }
  
  // 3. Usuń zwierzę
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting pet with id ${id}:`, error);
    throw error;
  }
};

export const getRelatedEntitiesCount = async (petId: string): Promise<{
  visitsCount: number;
  careProgramsCount: number;
}> => {
  // 1. Pobierz liczbę wizyt
  const { count: visitsCount, error: visitsError } = await supabase
    .from('visits')
    .select('id', { count: 'exact', head: true })
    .eq('petid', petId);
  
  if (visitsError) {
    console.error(`Error counting visits for pet ${petId}:`, visitsError);
    throw visitsError;
  }
  
  // 2. Pobierz liczbę programów opieki
  const { count: careProgramsCount, error: programsError } = await supabase
    .from('care_programs')
    .select('id', { count: 'exact', head: true })
    .eq('petid', petId);
  
  if (programsError) {
    console.error(`Error counting care programs for pet ${petId}:`, programsError);
    throw programsError;
  }
  
  return {
    visitsCount: visitsCount || 0,
    careProgramsCount: careProgramsCount || 0
  };
};
