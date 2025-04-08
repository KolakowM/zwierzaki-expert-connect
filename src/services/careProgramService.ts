
import { supabase } from "@/integrations/supabase/client";
import { CareProgram, DbCareProgram, mapDbCareProgramToCareProgram, mapCareProgramToDbCareProgram } from "@/types";

export const getCarePrograms = async (): Promise<CareProgram[]> => {
  const { data, error } = await supabase
    .from('care_programs')
    .select('*')
    .order('createdat', { ascending: false });
  
  if (error) {
    console.error('Error fetching care programs:', error);
    throw error;
  }
  
  return (data || []).map(program => mapDbCareProgramToCareProgram(program as DbCareProgram));
};

export const getCareProgramsByPetId = async (petId: string): Promise<CareProgram[]> => {
  const { data, error } = await supabase
    .from('care_programs')
    .select('*')
    .eq('petid', petId)
    .order('startdate', { ascending: false });
  
  if (error) {
    console.error(`Error fetching care programs for pet ${petId}:`, error);
    throw error;
  }
  
  return (data || []).map(program => mapDbCareProgramToCareProgram(program as DbCareProgram));
};

export const getCareProgramById = async (id: string): Promise<CareProgram | null> => {
  const { data, error } = await supabase
    .from('care_programs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching care program with id ${id}:`, error);
    return null;
  }
  
  return data ? mapDbCareProgramToCareProgram(data as DbCareProgram) : null;
};

export const createCareProgram = async (program: Omit<CareProgram, 'id' | 'createdAt'>): Promise<CareProgram> => {
  // Convert dates to ISO strings if they are Date objects
  const prepared = {
    ...program,
    startDate: typeof program.startDate === 'object' && program.startDate !== null ? program.startDate.toISOString() : program.startDate,
    endDate: typeof program.endDate === 'object' && program.endDate !== null ? program.endDate.toISOString() : program.endDate
  };

  const dbProgram = mapCareProgramToDbCareProgram(prepared);
  
  const { data, error } = await supabase
    .from('care_programs')
    .insert([dbProgram])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating care program:', error);
    throw error;
  }
  
  return mapDbCareProgramToCareProgram(data as DbCareProgram);
};

export const updateCareProgram = async (id: string, program: Partial<CareProgram>): Promise<CareProgram> => {
  // Convert dates to ISO strings if they are Date objects
  const prepared = {
    ...program,
    startDate: typeof program.startDate === 'object' && program.startDate !== null ? program.startDate.toISOString() : program.startDate,
    endDate: typeof program.endDate === 'object' && program.endDate !== null ? program.endDate.toISOString() : program.endDate
  };

  // Convert camelCase properties to snake_case for the database
  const dbProgramUpdate: Partial<DbCareProgram> = {};
  if (prepared.petId !== undefined) dbProgramUpdate.petid = prepared.petId;
  if (prepared.name !== undefined) dbProgramUpdate.name = prepared.name;
  if (prepared.description !== undefined) dbProgramUpdate.description = prepared.description;
  if (prepared.goal !== undefined) dbProgramUpdate.goal = prepared.goal;
  if (prepared.status !== undefined) dbProgramUpdate.status = prepared.status;
  if (prepared.recommendations !== undefined) dbProgramUpdate.recommendations = prepared.recommendations;
  if (prepared.instructions !== undefined) dbProgramUpdate.instructions = prepared.instructions;
  if (prepared.startDate !== undefined) dbProgramUpdate.startdate = prepared.startDate;
  if (prepared.endDate !== undefined) dbProgramUpdate.enddate = prepared.endDate;

  const { data, error } = await supabase
    .from('care_programs')
    .update(dbProgramUpdate)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating care program with id ${id}:`, error);
    throw error;
  }
  
  return mapDbCareProgramToCareProgram(data as DbCareProgram);
};

export const deleteCareProgram = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('care_programs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting care program with id ${id}:`, error);
    throw error;
  }
};
