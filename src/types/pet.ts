
export interface Pet {
  id: string;
  name: string;
  clientId: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  color?: string;
  medicalHistory?: string;
  createdAt: string;
  user_id: string;
}
