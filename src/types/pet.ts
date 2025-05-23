
// Pet types
export interface DbPet {
  id: string;
  clientid: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;  // Keeping for backward compatibility
  weight?: number | null;  // Decimal in database
  sex?: string | null;
  neutered?: boolean | null;
  neutering_date?: string | null; // Added neutering date field
  medicalhistory?: string | null;
  allergies?: string | null;
  dietaryrestrictions?: string | null;
  behavioralnotes?: string | null;
  createdat?: string;
  vaccination_description?: string | null;
  has_microchip: boolean;
  microchip_number?: string | null;
  date_of_birth?: string | null; // Added for date of birth
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;  // Keeping for backward compatibility
  weight?: number | null;  // Decimal in frontend
  sex?: string | null;
  neutered?: boolean | null;
  neuteringDate?: Date | string | null; // Added neutering date field
  medicalHistory?: string | null;
  allergies?: string | null;
  dietaryRestrictions?: string | null;
  behavioralNotes?: string | null;
  createdAt?: string;
  vaccinationDescription?: string | null;
  hasMicrochip: boolean;
  microchipNumber?: string | null;
  dateOfBirth?: Date | string | null; // Added for date of birth (can be Date object or ISO string)
}

// Mapping functions for pets
export const mapDbPetToPet = (dbPet: DbPet): Pet => ({
  id: dbPet.id,
  clientId: dbPet.clientid,
  name: dbPet.name,
  species: dbPet.species,
  breed: dbPet.breed,
  age: dbPet.age,
  weight: dbPet.weight,
  sex: dbPet.sex,
  neutered: dbPet.neutered,
  neuteringDate: dbPet.neutering_date, // Map neutering date
  medicalHistory: dbPet.medicalhistory,
  allergies: dbPet.allergies,
  dietaryRestrictions: dbPet.dietaryrestrictions,
  behavioralNotes: dbPet.behavioralnotes,
  createdAt: dbPet.createdat,
  vaccinationDescription: dbPet.vaccination_description,
  hasMicrochip: dbPet.has_microchip,
  microchipNumber: dbPet.microchip_number,
  dateOfBirth: dbPet.date_of_birth, // Map date of birth
});

export const mapPetToDbPet = (pet: Omit<Pet, 'id'>): Omit<DbPet, 'id'> => ({
  clientid: pet.clientId,
  name: pet.name,
  species: pet.species,
  breed: pet.breed,
  age: pet.age !== undefined && pet.age !== null 
    ? Math.round(Number(pet.age)) // Keep for backward compatibility
    : null,
  weight: pet.weight !== undefined && pet.weight !== null 
    ? Number(pet.weight) // Allow decimal for weight
    : null,
  sex: pet.sex,
  neutered: pet.neutered,
  neutering_date: pet.neuteringDate ? new Date(pet.neuteringDate).toISOString().split('T')[0] : null, // Format neutering date as YYYY-MM-DD
  medicalhistory: pet.medicalHistory,
  allergies: pet.allergies,
  dietaryrestrictions: pet.dietaryRestrictions,
  behavioralnotes: pet.behavioralNotes,
  vaccination_description: pet.vaccinationDescription,
  has_microchip: pet.hasMicrochip || false,
  microchip_number: pet.microchipNumber,
  date_of_birth: pet.dateOfBirth ? new Date(pet.dateOfBirth).toISOString().split('T')[0] : null, // Format date as YYYY-MM-DD
});
