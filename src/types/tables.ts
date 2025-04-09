
import { DbClient, Client } from './client';
import { DbPet, Pet } from './pet';
import { DbVisit, Visit } from './visit';
import { DbCareProgram, CareProgram } from './care-program';

// Type mappings between database and application types
export type Tables = {
  clients: DbClient;
  pets: DbPet;
  visits: DbVisit;
  care_programs: DbCareProgram;
};

// User ID can be used across types
export type WithUserId = {
  user_id: string;
};
