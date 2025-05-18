import { Visit } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const getVisits = async (): Promise<Visit[]> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) return [];
    
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('user_id', authUser.user.id);
      
    if (error) {
      console.error("Error fetching visits:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getVisits:", error);
    return [];
  }
};

export const getVisitById = async (visitId: string): Promise<Visit | null> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('id', visitId)
      .single();
      
    if (error) {
      console.error("Error fetching visit by id:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getVisitById:", error);
    return null;
  }
};

export const getVisitsByPetId = async (petId: string): Promise<Visit[]> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('petid', petId);
      
    if (error) {
      console.error("Error fetching visits by pet id:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getVisitsByPetId:", error);
    return [];
  }
};

export const createVisit = async (visit: Omit<Visit, 'id' | 'createdAt'>): Promise<Visit> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) throw new Error("User not authenticated");
    
    const newVisit = {
      ...visit,
      user_id: authUser.user.id,
      status: visit.status || "scheduled",
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('visits')
      .insert([newVisit])
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating visit:", error);
    throw error;
  }
};

export const updateVisit = async (id: string, visit: Partial<Visit>): Promise<Visit> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .update(visit)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error updating visit:", error);
    throw error;
  }
};

export const deleteVisit = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('visits')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting visit:", error);
    throw error;
  }
};
