
export interface Visit {
  id: string;
  date: string;
  time: string;
  clientId: string;
  petId: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: string;
  followUp?: string;
  createdAt: string;
  user_id: string;
}
