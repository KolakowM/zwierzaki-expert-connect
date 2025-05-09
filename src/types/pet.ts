
// Pet types
export interface DbPet {
  id: string;
  clientid: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;  // Integer in database
  weight?: number | null;  // Decimal in database
  sex?: string | null;
  neutered?: boolean | null;
  medicalhistory?: string | null;
  allergies?: string | null;
  dietaryrestrictions?: string | null;
  behavioralnotes?: string | null;
  createdat?: string;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;  // Integer in frontend
  weight?: number | null;  // Decimal in frontend
  sex?: string | null;
  neutered?: boolean | null;
  medicalHistory?: string | null;
  allergies?: string | null;
  dietaryRestrictions?: string | null;
  behavioralNotes?: string | null;
  createdAt?: string;
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
  medicalHistory: dbPet.medicalhistory,
  allergies: dbPet.allergies,
  dietaryRestrictions: dbPet.dietaryrestrictions,
  behavioralNotes: dbPet.behavioralnotes,
  createdAt: dbPet.createdat,
});

export const mapPetToDbPet = (pet: Omit<Pet, 'id'>): Omit<DbPet, 'id'> => ({
  clientid: pet.clientId,
  name: pet.name,
  species: pet.species,
  breed: pet.breed,
  age: pet.age !== undefined && pet.age !== null 
    ? Math.round(Number(pet.age)) // Ensure age is an integer
    : null,
  weight: pet.weight !== undefined && pet.weight !== null 
    ? Number(pet.weight) // Allow decimal for weight
    : null,
  sex: pet.sex,
  neutered: pet.neutered,
  medicalhistory: pet.medicalHistory,
  allergies: pet.allergies,
  dietaryrestrictions: pet.dietaryRestrictions,
  behavioralnotes: pet.behavioralNotes,
});
