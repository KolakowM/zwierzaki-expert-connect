
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
  followUpNeeded?: boolean;
  followUpDate?: string;
  recommendations?: string;
  createdAt: string;
  user_id: string;
}
