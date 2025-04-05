
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postCode?: string;
  createdAt: string;
  notes?: string;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: "pies" | "kot" | "królik" | "chomik" | "świnka morska" | "inne";
  breed?: string;
  age?: number;
  weight?: number;
  sex?: "samiec" | "samica";
  neutered?: boolean;
  medicalHistory?: string;
  allergies?: string;
  dietaryRestrictions?: string;
  behavioralNotes?: string;
  createdAt: string;
}

export interface Visit {
  id: string;
  petId: string;
  clientId: string;
  date: string;
  type: string;
  notes?: string;
  recommendations?: string;
  followUpNeeded?: boolean;
  followUpDate?: string;
}

export interface CareProgram {
  id: string;
  petId: string;
  name: string;
  goal: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: "aktywny" | "zakończony" | "anulowany";
  instructions?: string;
  recommendations?: string;
  createdAt: string;
}
