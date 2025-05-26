
import { supabase } from "@/integrations/supabase/client";
import { CareProgram, mapDbCareProgramToCareProgram, mapCareProgramToDbCareProgram } from "@/types/care-program";

export const getCarePrograms = async (): Promise<CareProgram[]> => {
  const { data, error } = await supabase
    .from('care_programs')
    .select('*')
    .order('startdate', { ascending: false });

  if (error) {
    console.error('Error fetching care programs:', error);
    throw error;
  }

  return (data || []).map(mapDbCareProgramToCareProgram);
};

export const getCareProgramsByPetId = async (petId: string): Promise<CareProgram[]> => {
  const { data, error } = await supabase
    .from('care_programs')
    .select('*')
    .eq('petid', petId)
    .order('startdate', { ascending: false });

  if (error) {
    console.error('Error fetching care programs by pet ID:', error);
    throw error;
  }

  return (data || []).map(mapDbCareProgramToCareProgram);
};

export const getCareProgramById = async (id: string): Promise<CareProgram | null> => {
  const { data, error } = await supabase
    .from('care_programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching care program:', error);
    throw error;
  }

  return data ? mapDbCareProgramToCareProgram(data) : null;
};

export const createCareProgram = async (careProgram: Omit<CareProgram, 'id' | 'createdAt'>): Promise<CareProgram> => {
  const dbCareProgram = mapCareProgramToDbCareProgram(careProgram);
  
  const { data, error } = await supabase
    .from('care_programs')
    .insert(dbCareProgram)
    .select()
    .single();

  if (error) {
    console.error('Error creating care program:', error);
    throw error;
  }

  return mapDbCareProgramToCareProgram(data);
};

export const updateCareProgram = async (id: string, updates: Partial<CareProgram>): Promise<CareProgram> => {
  // Convert partial updates to database format
  const dbUpdates: any = {};
  
  if (updates.petId !== undefined) dbUpdates.petid = updates.petId;
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.goal !== undefined) dbUpdates.goal = updates.goal;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.startDate !== undefined) dbUpdates.startdate = updates.startDate.toISOString();
  if (updates.endDate !== undefined) dbUpdates.enddate = updates.endDate ? updates.endDate.toISOString() : null;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.instructions !== undefined) dbUpdates.instructions = updates.instructions;
  if (updates.recommendations !== undefined) dbUpdates.recommendations = updates.recommendations;

  const { data, error } = await supabase
    .from('care_programs')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating care program:', error);
    throw error;
  }

  return mapDbCareProgramToCareProgram(data);
};

export const deleteCareProgram = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('care_programs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting care program:', error);
    throw error;
  }
};

export const deleteCareProgramWithRelatedData = async (id: string): Promise<void> => {
  // In a real implementation, you might need to delete related data first
  // For now, we'll just delete the care program
  await deleteCareProgram(id);
};
