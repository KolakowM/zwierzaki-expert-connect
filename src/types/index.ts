
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

export type Tables = {
  clients: Client;
  pets: Pet;
  visits: Visit;
  care_programs: CareProgram;
};
