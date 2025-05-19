import { supabase } from "@/integrations/supabase/client";
import { Visit, DbVisit, mapDbVisitToVisit, mapVisitToDbVisit } from "@/types";

export const getVisits = async (): Promise<Visit[]> => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }
  
  return (data || []).map(visit => mapDbVisitToVisit(visit as DbVisit));
};

export const getVisitsByClientId = async (clientId: string): Promise<Visit[]> => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('clientid', clientId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching visits for client ${clientId}:`, error);
    throw error;
  }
  
  return (data || []).map(visit => mapDbVisitToVisit(visit as DbVisit));
};

export const getVisitsByPetId = async (petId: string): Promise<Visit[]> => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('petid', petId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching visits for pet ${petId}:`, error);
    throw error;
  }
  
  return (data || []).map(visit => mapDbVisitToVisit(visit as DbVisit));
};

export const getVisitById = async (id: string): Promise<Visit | null> => {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching visit with id ${id}:`, error);
    return null;
  }
  
  return data ? mapDbVisitToVisit(data as DbVisit) : null;
};

export const createVisit = async (visit: Omit<Visit, 'id'>): Promise<Visit> => {
  const dbVisit = mapVisitToDbVisit(visit);
  
  const { data, error } = await supabase
    .from('visits')
    .insert([dbVisit])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
  
  return mapDbVisitToVisit(data as DbVisit);
};

export const updateVisit = async (id: string, visit: Partial<Visit>): Promise<Visit> => {
  // Convert dates to ISO strings if they are Date objects
  const prepared = {
    ...visit,
    date: visit.date instanceof Date ? visit.date.toISOString() : visit.date,
    followUpDate: visit.followUpDate instanceof Date ? visit.followUpDate.toISOString() : visit.followUpDate
  };
  
  // Convert camelCase visit properties to snake_case for the database
  const dbVisitUpdate: Partial<DbVisit> = {};
  if (prepared.petId !== undefined) dbVisitUpdate.petid = prepared.petId;
  if (prepared.clientId !== undefined) dbVisitUpdate.clientid = prepared.clientId;
  if (prepared.date !== undefined) dbVisitUpdate.date = prepared.date;
  if (prepared.time !== undefined) dbVisitUpdate.time = prepared.time;
  if (prepared.type !== undefined) dbVisitUpdate.type = prepared.type;
  if (prepared.notes !== undefined) dbVisitUpdate.notes = prepared.notes;
  if (prepared.recommendations !== undefined) dbVisitUpdate.recommendations = prepared.recommendations;
  if (prepared.followUpNeeded !== undefined) dbVisitUpdate.followupneeded = prepared.followUpNeeded;
  if (prepared.followUpDate !== undefined) dbVisitUpdate.followupdate = prepared.followUpDate;

  const { data, error } = await supabase
    .from('visits')
    .update(dbVisitUpdate)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating visit with id ${id}:`, error);
    throw error;
  }
  
  return mapDbVisitToVisit(data as DbVisit);
};

export const deleteVisit = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting visit with id ${id}:`, error);
    throw error;
  }
};
