
// CareProgram types
export interface DbCareProgram {
  id: string;
  petid: string;
  name: string;
  goal: string;
  description?: string | null;
  startdate: string;
  enddate?: string | null;
  status: "aktywny" | "zakończony" | "anulowany";
  instructions?: string | null;
  recommendations?: string | null;
  createdat: string;
}

export interface CareProgram {
  id: string;
  petId: string;
  name: string;
  goal: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: "aktywny" | "zakończony" | "anulowany";
  instructions?: string | null;
  recommendations?: string | null;
  createdAt: string;
}

// Mapping functions for care programs
export const mapDbCareProgramToCareProgram = (dbProgram: DbCareProgram): CareProgram => ({
  id: dbProgram.id,
  petId: dbProgram.petid,
  name: dbProgram.name,
  goal: dbProgram.goal,
  description: dbProgram.description,
  startDate: dbProgram.startdate,
  endDate: dbProgram.enddate,
  status: dbProgram.status,
  instructions: dbProgram.instructions,
  recommendations: dbProgram.recommendations,
  createdAt: dbProgram.createdat,
});

export const mapCareProgramToDbCareProgram = (program: Omit<CareProgram, 'id' | 'createdAt'>): Omit<DbCareProgram, 'id' | 'createdat'> => ({
  petid: program.petId,
  name: program.name,
  goal: program.goal,
  description: program.description,
  startdate: program.startDate,
  enddate: program.endDate,
  status: program.status,
  instructions: program.instructions,
  recommendations: program.recommendations,
});
