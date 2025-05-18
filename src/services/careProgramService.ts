
import { CareProgram } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const getCarePrograms = async (): Promise<CareProgram[]> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) return [];
    
    const { data, error } = await supabase
      .from('care_programs')
      .select('*');
      
    if (error) {
      console.error("Error fetching care programs:", error);
      return [];
    }
    
    return data || [];
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
    
    return data;
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
    
    return data || [];
  } catch (error) {
    console.error("Error in getCareProgramsByPetId:", error);
    return [];
  }
};

export const createCareProgram = async (program: Omit<CareProgram, 'id' | 'createdAt'>): Promise<CareProgram> => {
  try {
    const newProgram = {
      ...program,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('care_programs')
      .insert([newProgram])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating care program:", error);
    throw error;
  }
};

export const updateCareProgram = async (id: string, program: Partial<CareProgram>): Promise<CareProgram> => {
  try {
    const { data, error } = await supabase
      .from('care_programs')
      .update(program)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
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
