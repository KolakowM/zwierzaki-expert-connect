
import { Visit, mapDbVisitToVisit } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Helper function to map Visit type to database format
export function mapVisitToDbVisit(visit: Partial<Visit>): any {
  const dbVisit: any = {};
  
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
  
  return dbVisit;
}

export const getVisits = async (): Promise<Visit[]> => {
  try {
    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser.user) return [];
    
    // Najpierw pobierz klientów zalogowanego użytkownika
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', authUser.user.id);
      
    if (clientsError || !clients || clients.length === 0) {
      console.error("Error fetching clients or no clients found:", clientsError);
      return [];
    }
    
    // Pobierz wizyty przypisane do klientów tego użytkownika
    const clientIds = clients.map(client => client.id);
    const { data: visits, error: visitsError } = await supabase
      .from('visits')
      .select('*')
      .in('clientid', clientIds);
      
    if (visitsError) {
      console.error("Error fetching visits:", visitsError);
      return [];
    }
    
    return visits ? visits.map(mapDbVisitToVisit) : [];
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

export const createVisit = async (visit: Omit<Visit, 'id' | 'createdAt' | 'user_id'>): Promise<Visit> => {
  try {
    const dbVisit = mapVisitToDbVisit(visit);
    
    // Ensure required fields are provided
    if (!dbVisit.date) throw new Error("Visit date is required");
    if (!dbVisit.type) throw new Error("Visit type is required");
    if (!dbVisit.petid) throw new Error("Pet ID is required");
    if (!dbVisit.clientid) throw new Error("Client ID is required");
    
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
