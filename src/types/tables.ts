
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

// Mapping functions for user roles
export const mapDbUserRoleToUserRole = (dbUserRole: DbUserRole): UserRole => ({
  id: dbUserRole.id,
  userId: dbUserRole.user_id,
  role: dbUserRole.role,
  createdAt: dbUserRole.created_at,
});

export const mapUserRoleToDbUserRole = (userRole: Omit<UserRole, 'id' | 'createdAt'>): Omit<DbUserRole, 'id' | 'created_at'> => ({
  user_id: userRole.userId,
  role: userRole.role,
});

// Type mappings between database and application types
export type Tables = {
  clients: DbClient;
  pets: DbPet;
  visits: DbVisit;
  care_programs: DbCareProgram;
  user_roles: DbUserRole;
};
