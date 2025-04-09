
import { DbClient, Client } from './client';
import { DbPet, Pet } from './pet';
import { DbVisit, Visit } from './visit';
import { DbCareProgram, CareProgram } from './care-program';

// Define user role type
export interface DbUserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string | null;
}

export interface UserRole {
  id: string;
  userId: string;
  role: 'admin' | 'user';
  createdAt: string | null;
}

// Type mappings between database and application types
export type Tables = {
  clients: DbClient;
  pets: DbPet;
  visits: DbVisit;
  care_programs: DbCareProgram;
  user_roles: DbUserRole;
};
