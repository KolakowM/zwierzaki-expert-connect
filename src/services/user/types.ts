
export type AppRole = 'user' | 'admin';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string | null;
}

export interface UserMetadata {
  name?: string;
  role?: string;
  status?: string;
}
