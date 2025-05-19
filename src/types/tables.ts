
import { DbClient } from './client';
import { DbPet } from './pet';
import { DbVisit } from './visit';
import { DbCareProgram } from './care-program';

// Type mappings between database and application types
export type Tables = {
  clients: DbClient;
  pets: DbPet;
  visits: DbVisit;
  care_programs: DbCareProgram;
};
