
import { Client } from './client';
import { Pet } from './pet';
import { Visit } from './visit';
import { CareProgram } from './care-program';

// Type mappings between database and application types
export type Tables = {
  clients: Client;
  pets: Pet;
  visits: Visit;
  care_programs: CareProgram;
};
