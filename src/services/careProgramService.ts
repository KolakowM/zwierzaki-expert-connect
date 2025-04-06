
import { supabase } from "@/integrations/supabase/client";
import { CareProgram } from "@/types";

export const getCarePrograms = async (): Promise<CareProgram[]> => {
  const { data, error } = await supabase
    .from('care_programs')
    .select('*')
    .order('createdAt', { ascending: false });
  
  if (error) {
    console.error('Error fetching care programs:', error);
    throw error;
  }
  
  return data as unknown as CareProgram[];
};

export const getCareProgramsByPetId = async (petId: string): Promise<CareProgram[]> => {
  const { data, error } = await supabase
    .from('care_programs')
    .select('*')
    .eq('petId', petId)
    .order('startDate', { ascending: false });
  
  if (error) {
    console.error(`Error fetching care programs for pet ${petId}:`, error);
    throw error;
  }
  
  return data as unknown as CareProgram[];
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
  
  return data as unknown as CareProgram;
};

export const createCareProgram = async (program: Omit<CareProgram, 'id' | 'createdAt'>): Promise<CareProgram> => {
  const { data, error } = await supabase
    .from('care_programs')
    .insert([program])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating care program:', error);
    throw error;
  }
  
  return data as unknown as CareProgram;
};

export const updateCareProgram = async (id: string, program: Partial<CareProgram>): Promise<CareProgram> => {
  const { data, error } = await supabase
    .from('care_programs')
    .update(program)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating care program with id ${id}:`, error);
    throw error;
  }
  
  return data as unknown as CareProgram;
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
