
export interface Pet {
  id: string;
  name: string;
  clientId: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  color?: string;
  sex?: 'samiec' | 'samica';
  neutered?: boolean;
  hasMicrochip?: boolean;
  microchipNumber?: string;
  medicalHistory?: string;
  allergies?: string;
  dietaryRestrictions?: string;
  behavioralNotes?: string;
  vaccinationDescription?: string;
  createdAt: string;
}
