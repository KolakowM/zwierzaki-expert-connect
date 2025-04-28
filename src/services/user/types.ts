
export type AppRole = 'admin' | 'user' | 'specialist';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  status: string;
  lastLogin?: string | null;
}
