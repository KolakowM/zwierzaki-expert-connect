
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
  const dbProgram = mapCareProgramToDbCareProgram(program);
  
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
  // Convert camelCase program properties to snake_case for the database
  const dbProgramUpdate: Partial<DbCareProgram> = {};
  if (program.petId !== undefined) dbProgramUpdate.petid = program.petId;
  if (program.name !== undefined) dbProgramUpdate.name = program.name;
  if (program.goal !== undefined) dbProgramUpdate.goal = program.goal;
  if (program.description !== undefined) dbProgramUpdate.description = program.description;
  if (program.startDate !== undefined) dbProgramUpdate.startdate = program.startDate;
  if (program.endDate !== undefined) dbProgramUpdate.enddate = program.endDate;
  if (program.status !== undefined) dbProgramUpdate.status = program.status;
  if (program.instructions !== undefined) dbProgramUpdate.instructions = program.instructions;
  if (program.recommendations !== undefined) dbProgramUpdate.recommendations = program.recommendations;

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
