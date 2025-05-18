
import { CareProgram } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Helper function to map database schema to app schema
const mapDbToCareProgram = (item: any): CareProgram => {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    petId: item.petid,
    startDate: item.startdate,
    endDate: item.enddate,
    status: item.status,
    goal: item.goal,
    instructions: item.instructions,
    recommendations: item.recommendations,
    createdAt: item.createdat || item.created_at
  };
};

export const getCarePrograms = async (): Promise<CareProgram[]> => {
  try {
    const { data, error } = await supabase
      .from('care_programs')
      .select('*');
      
    if (error) {
      console.error("Error fetching care programs:", error);
      return [];
    }
    
    return data ? data.map(mapDbToCareProgram) : [];
  } catch (error) {
    console.error("Error in getCarePrograms:", error);
    return [];
  }
};

export const getCareProgramById = async (id: string): Promise<CareProgram | null> => {
  try {
    const { data, error } = await supabase
      .from('care_programs')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching care program by id:", error);
      return null;
    }
    
    return data ? mapDbToCareProgram(data) : null;
  } catch (error) {
    console.error("Error in getCareProgramById:", error);
    return null;
  }
};

export const getCareProgramsByPetId = async (petId: string): Promise<CareProgram[]> => {
  try {
    const { data, error } = await supabase
      .from('care_programs')
      .select('*')
      .eq('petid', petId);
      
    if (error) {
      console.error("Error fetching care programs by pet id:", error);
      return [];
    }
    
    return data ? data.map(mapDbToCareProgram) : [];
  } catch (error) {
    console.error("Error in getCareProgramsByPetId:", error);
    return [];
  }
};

export const createCareProgram = async (program: Omit<CareProgram, 'id' | 'createdAt'>): Promise<CareProgram> => {
  try {
    // Convert camelCase to snake_case for database
    const newProgram = {
      name: program.name,
      description: program.description,
      petid: program.petId,
      startdate: program.startDate,
      enddate: program.endDate,
      status: program.status,
      goal: program.goal,
      instructions: program.instructions,
      recommendations: program.recommendations,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('care_programs')
      .insert([newProgram])
      .select()
      .single();
      
    if (error) throw error;
    
    return mapDbToCareProgram(data);
  } catch (error) {
    console.error("Error creating care program:", error);
    throw error;
  }
};

export const updateCareProgram = async (id: string, program: Partial<CareProgram>): Promise<CareProgram> => {
  try {
    // Convert camelCase to snake_case for database
    const updateData: any = {};
    
    if (program.name) updateData.name = program.name;
    if (program.description !== undefined) updateData.description = program.description;
    if (program.petId) updateData.petid = program.petId;
    if (program.startDate) updateData.startdate = program.startDate;
    if (program.endDate !== undefined) updateData.enddate = program.endDate;
    if (program.status) updateData.status = program.status;
    if (program.goal) updateData.goal = program.goal;
    if (program.instructions !== undefined) updateData.instructions = program.instructions;
    if (program.recommendations !== undefined) updateData.recommendations = program.recommendations;
    
    const { data, error } = await supabase
      .from('care_programs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapDbToCareProgram(data);
  } catch (error) {
    console.error("Error updating care program:", error);
    throw error;
  }
};

export const deleteCareProgram = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('care_programs')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting care program:", error);
    throw error;
  }
};
