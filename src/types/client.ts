
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postCode?: string;
  notes?: string;
  createdAt: string;
  user_id: string;
}
