
import { Pet } from "@/types";

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
  
  return dbPet;
}
