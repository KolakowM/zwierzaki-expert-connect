
import { Visit, mapDbVisitToVisit } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Helper function to map Visit type to database format
export function mapVisitToDbVisit(visit: Partial<Visit>): Record<string, any> {
  const dbVisit: Record<string, any> = {};
  
  if (visit.date !== undefined) dbVisit.date = visit.date;
  if (visit.time !== undefined) dbVisit.time = visit.time;
  if (visit.clientId !== undefined) dbVisit.clientid = visit.clientId;
  if (visit.petId !== undefined) dbVisit.petid = visit.petId;
  if (visit.notes !== undefined) dbVisit.notes = visit.notes;
  if (visit.status !== undefined) dbVisit.status = visit.status;
  if (visit.type !== undefined) dbVisit.type = visit.type;
  if (visit.followUp !== undefined) dbVisit.followup = visit.followUp;
  if (visit.followUpNeeded !== undefined) dbVisit.followupneeded = visit.followUpNeeded;
  if (visit.followUpDate !== undefined) dbVisit.followupdate = visit.followUpDate;
  if (visit.recommendations !== undefined) dbVisit.recommendations = visit.recommendations;
  if (visit.user_id !== undefined) dbVisit.user_id = visit.user_id;
  
  return dbVisit;
}

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
    
    return data ? data.map(mapDbVisitToVisit) : [];
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
    
    return data ? mapDbVisitToVisit(data) : null;
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
    
    return data ? data.map(mapDbVisitToVisit) : [];
  } catch (error) {
    console.error("Error in getVisitsByPetId:", error);
    return [];
  }
};

export const createVisit = async (visit: Omit<Visit, 'id' | 'createdAt'>): Promise<Visit> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) throw new Error("User not authenticated");
    
    const dbVisit = mapVisitToDbVisit(visit);
    dbVisit.user_id = authUser.user.id; // Always ensure user_id is set
    
    const { data, error } = await supabase
      .from('visits')
      .insert([dbVisit]) // Insert as an array with one object
      .select()
      .single();
      
    if (error) throw error;
    
    return mapDbVisitToVisit(data);
  } catch (error) {
    console.error("Error creating visit:", error);
    throw error;
  }
};

export const updateVisit = async (id: string, visit: Partial<Visit>): Promise<Visit> => {
  try {
    const dbVisit = mapVisitToDbVisit(visit);
    
    const { data, error } = await supabase
      .from('visits')
      .update(dbVisit)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return mapDbVisitToVisit(data);
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
