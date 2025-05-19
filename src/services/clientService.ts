
import { supabase } from "@/integrations/supabase/client";
import { Client, DbClient, mapDbClientToClient, mapClientToDbClient } from "@/types";

// Main client operations
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('createdat', { ascending: false });
  
  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
  
  return (data || []).map(client => mapDbClientToClient(client as DbClient));
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching client with id ${id}:`, error);
    return null;
  }
  
  return data ? mapDbClientToClient(data as DbClient) : null;
};

export const createClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
  // Get current user ID from session
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session?.user?.id) {
    throw new Error('User must be logged in to create a client');
  }
  
  const dbClient = {
    ...mapClientToDbClient(client),
    user_id: sessionData.session.user.id
  };
  
  const { data, error } = await supabase
    .from('clients')
    .insert([dbClient])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }
  
  return mapDbClientToClient(data as DbClient);
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  // Convert client properties to DB format
  const dbClientUpdate = convertClientToDbFormat(client);

  const { data, error } = await supabase
    .from('clients')
    .update(dbClientUpdate)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating client with id ${id}:`, error);
    throw error;
  }
  
  return mapDbClientToClient(data as DbClient);
};

// Helper function to convert client fields to DB format
const convertClientToDbFormat = (client: Partial<Client>): Partial<DbClient> => {
  const dbClientUpdate: Partial<DbClient> = {};
  
  if (client.firstName) dbClientUpdate.firstname = client.firstName;
  if (client.lastName) dbClientUpdate.lastname = client.lastName;
  if (client.email) dbClientUpdate.email = client.email;
  if (client.phone !== undefined) dbClientUpdate.phone = client.phone;
  if (client.address !== undefined) dbClientUpdate.address = client.address;
  if (client.city !== undefined) dbClientUpdate.city = client.city;
  if (client.postCode !== undefined) dbClientUpdate.postcode = client.postCode;
  if (client.notes !== undefined) dbClientUpdate.notes = client.notes;
  
  return dbClientUpdate;
};

// Delete operations - cascading delete pattern
export const deleteClient = async (id: string): Promise<void> => {
  try {
    // 1. Delete related visits
    await deleteClientVisits(id);
    
    // 2. Handle pets and their care programs
    await deleteClientPetsAndCarePrograms(id);
    
    // 3. Delete the client
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error during client deletion process (ID: ${id}):`, error);
    throw error;
  }
};

// Helper function to delete client visits
const deleteClientVisits = async (clientId: string): Promise<void> => {
  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('clientid', clientId);
  
  if (error) {
    console.error(`Error deleting visits for client ${clientId}:`, error);
    throw error;
  }
};

// Helper function to delete client's pets and related care programs
const deleteClientPetsAndCarePrograms = async (clientId: string): Promise<void> => {
  // Get all pet IDs for this client
  const { data: pets, error: petsError } = await supabase
    .from('pets')
    .select('id')
    .eq('clientid', clientId);
  
  if (petsError) {
    console.error(`Error fetching pets for client ${clientId}:`, petsError);
    throw petsError;
  }
  
  if (pets && pets.length > 0) {
    const petIds = pets.map(pet => pet.id);
    
    // Delete related care programs
    await deletePetsCarePrograms(petIds);
    
    // Delete all pets
    const { error: deleteAllPetsError } = await supabase
      .from('pets')
      .delete()
      .eq('clientid', clientId);
    
    if (deleteAllPetsError) {
      console.error(`Error deleting pets for client ${clientId}:`, deleteAllPetsError);
      throw deleteAllPetsError;
    }
  }
};

// Helper function to delete care programs for multiple pets
const deletePetsCarePrograms = async (petIds: string[]): Promise<void> => {
  const { error: careProgramsError } = await supabase
    .from('care_programs')
    .delete()
    .in('petid', petIds);
  
  if (careProgramsError) {
    console.error(`Error deleting care programs for pets:`, careProgramsError);
    throw careProgramsError;
  }
};

// Analytics and related data
export const getRelatedEntitiesCount = async (clientId: string): Promise<{
  petsCount: number;
  visitsCount: number;
  careProgramsCount: number;
}> => {
  try {
    // Get pets count and IDs
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('id', { count: 'exact' })
      .eq('clientid', clientId);
    
    if (petsError) throw petsError;
    
    // Get visits count
    const { count: visitsCount, error: visitsError } = await supabase
      .from('visits')
      .select('id', { count: 'exact', head: true })
      .eq('clientid', clientId);
    
    if (visitsError) throw visitsError;
    
    // Get care programs count if we have pets
    let careProgramsCount = 0;
    if (pets && pets.length > 0) {
      const petIds = pets.map(pet => pet.id);
      
      const { count: programsCount, error: programsError } = await supabase
        .from('care_programs')
        .select('id', { count: 'exact', head: true })
        .in('petid', petIds);
      
      if (programsError) throw programsError;
      careProgramsCount = programsCount || 0;
    }
    
    return {
      petsCount: pets?.length || 0,
      visitsCount: visitsCount || 0,
      careProgramsCount
    };
  } catch (error) {
    console.error(`Error getting related entities for client ${clientId}:`, error);
    throw error;
  }
};
