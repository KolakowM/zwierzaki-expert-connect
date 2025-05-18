
export interface CareProgram {
  id: string;
  name: string;
  description?: string;
  petId: string;
  startDate: string;
  endDate?: string;
  status: string;
  goal: string;
  instructions?: string;
  recommendations?: string;
  createdAt: string;
}
