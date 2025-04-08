// Database types from Supabase (snake_case)
export interface DbClient {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postcode?: string | null;
  createdat: string;
  notes?: string | null;
}

export interface DbPet {
  id: string;
  clientid: string;
  name: string;
  species: "pies" | "kot" | "królik" | "chomik" | "świnka morska" | "inne";
  breed?: string | null;
  age?: number | null;
  weight?: number | null;
  sex?: "samiec" | "samica" | null;
  neutered?: boolean | null;
  medicalhistory?: string | null;
  allergies?: string | null;
  dietaryrestrictions?: string | null;
  behavioralnotes?: string | null;
  createdat: string;
}

export interface DbVisit {
  id: string;
  petid: string;
  clientid: string;
  date: string;
  time?: string | null;
  type: string;
  notes?: string | null;
  recommendations?: string | null;
  followupneeded?: boolean | null;
  followupdate?: string | null;
}

export interface DbCareProgram {
  id: string;
  petid: string;
  name: string;
  goal: string;
  description?: string | null;
  startdate: string;
  enddate?: string | null;
  status: "aktywny" | "zakończony" | "anulowany";
  instructions?: string | null;
  recommendations?: string | null;
  createdat: string;
}

// Application types with camelCase used in the frontend (matches existing interfaces)
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postCode?: string | null;
  createdAt: string;
  notes?: string | null;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: "pies" | "kot" | "królik" | "chomik" | "świnka morska" | "inne";
  breed?: string | null;
  age?: number | null;
  weight?: number | null;
  sex?: "samiec" | "samica" | null;
  neutered?: boolean | null;
  medicalHistory?: string | null;
  allergies?: string | null;
  dietaryRestrictions?: string | null;
  behavioralNotes?: string | null;
  createdAt: string;
}

export interface Visit {
  id: string;
  petId: string;
  clientId: string;
  date: string;
  time?: string | null;
  type: string;
  notes?: string | null;
  recommendations?: string | null;
  followUpNeeded?: boolean | null;
  followUpDate?: string | null;
}

export interface CareProgram {
  id: string;
  petId: string;
  name: string;
  goal: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: "aktywny" | "zakończony" | "anulowany";
  instructions?: string | null;
  recommendations?: string | null;
  createdAt: string;
}

// Type mappings between database and application types
export type Tables = {
  clients: DbClient;
  pets: DbPet;
  visits: DbVisit;
  care_programs: DbCareProgram;
};

// Mapping functions
export const mapDbClientToClient = (dbClient: DbClient): Client => ({
  id: dbClient.id,
  firstName: dbClient.firstname,
  lastName: dbClient.lastname,
  email: dbClient.email,
  phone: dbClient.phone,
  address: dbClient.address,
  city: dbClient.city,
  postCode: dbClient.postcode,
  createdAt: dbClient.createdat,
  notes: dbClient.notes,
});

export const mapClientToDbClient = (client: Omit<Client, 'id' | 'createdAt'>): Omit<DbClient, 'id' | 'createdat'> => ({
  firstname: client.firstName,
  lastname: client.lastName,
  email: client.email,
  phone: client.phone,
  address: client.address,
  city: client.city,
  postcode: client.postCode,
  notes: client.notes,
});

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

export const mapPetToDbPet = (pet: Omit<Pet, 'id' | 'createdAt'>): Omit<DbPet, 'id' | 'createdat'> => ({
  clientid: pet.clientId,
  name: pet.name,
  species: pet.species,
  breed: pet.breed,
  age: pet.age,
  weight: pet.weight,
  sex: pet.sex,
  neutered: pet.neutered,
  medicalhistory: pet.medicalHistory,
  allergies: pet.allergies,
  dietaryrestrictions: pet.dietaryRestrictions,
  behavioralnotes: pet.behavioralNotes,
});

export const mapDbVisitToVisit = (dbVisit: DbVisit): Visit => ({
  id: dbVisit.id,
  petId: dbVisit.petid,
  clientId: dbVisit.clientid,
  date: dbVisit.date,
  time: dbVisit.time,
  type: dbVisit.type,
  notes: dbVisit.notes,
  recommendations: dbVisit.recommendations,
  followUpNeeded: dbVisit.followupneeded,
  followUpDate: dbVisit.followupdate,
});

export const mapVisitToDbVisit = (visit: Omit<Visit, 'id'>): Omit<DbVisit, 'id'> => ({
  petid: visit.petId,
  clientid: visit.clientId,
  date: visit.date,
  time: visit.time,
  type: visit.type,
  notes: visit.notes,
  recommendations: visit.recommendations,
  followupneeded: visit.followUpNeeded,
  followupdate: visit.followUpDate,
});

export const mapDbCareProgramToCareProgram = (dbProgram: DbCareProgram): CareProgram => ({
  id: dbProgram.id,
  petId: dbProgram.petid,
  name: dbProgram.name,
  goal: dbProgram.goal,
  description: dbProgram.description,
  startDate: dbProgram.startdate,
  endDate: dbProgram.enddate,
  status: dbProgram.status,
  instructions: dbProgram.instructions,
  recommendations: dbProgram.recommendations,
  createdAt: dbProgram.createdat,
});

export const mapCareProgramToDbCareProgram = (program: Omit<CareProgram, 'id' | 'createdAt'>): Omit<DbCareProgram, 'id' | 'createdat'> => ({
  petid: program.petId,
  name: program.name,
  goal: program.goal,
  description: program.description,
  startdate: program.startDate,
  enddate: program.endDate,
  status: program.status,
  instructions: program.instructions,
  recommendations: program.recommendations,
});
