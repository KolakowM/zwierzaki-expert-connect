
// CareProgram types
export interface DbCareProgram {
  id: string;
  petid: string;
  name: string;
  goal: string;
  description?: string | null;
  startdate: string; // ISO date string format
  enddate?: string | null; // ISO date string format
  status: "aktywny" | "planowany" | "zakończony" | "wstrzymany";
  instructions?: string | null;
  recommendations?: string | null;
  createdat: string; // ISO date string format
}

export interface CareProgram {
  id: string;
  petId: string;
  name: string;
  goal: string;
  description?: string | null;
  startDate: Date; // Date object in application
  endDate?: Date | null; // Date object in application
  status: "aktywny" | "planowany" | "zakończony" | "wstrzymany";
  instructions?: string | null;
  recommendations?: string | null;
  createdAt: Date; // Date object in application
}

// Mapping functions for care programs
export const mapDbCareProgramToCareProgram = (dbProgram: DbCareProgram): CareProgram => ({
  id: dbProgram.id,
  petId: dbProgram.petid,
  name: dbProgram.name,
  goal: dbProgram.goal,
  description: dbProgram.description,
  startDate: new Date(dbProgram.startdate),
  endDate: dbProgram.enddate ? new Date(dbProgram.enddate) : null,
  status: dbProgram.status,
  instructions: dbProgram.instructions,
  recommendations: dbProgram.recommendations,
  createdAt: new Date(dbProgram.createdat),
});

export const mapCareProgramToDbCareProgram = (program: Omit<CareProgram, 'id' | 'createdAt'>): Omit<DbCareProgram, 'id' | 'createdat'> => ({
  petid: program.petId,
  name: program.name,
  goal: program.goal,
  description: program.description,
  startdate: program.startDate.toISOString(),
  enddate: program.endDate ? program.endDate.toISOString() : null,
  status: program.status,
  instructions: program.instructions,
  recommendations: program.recommendations,
});
