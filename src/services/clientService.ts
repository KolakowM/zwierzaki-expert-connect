
import { supabase } from "@/integrations/supabase/client";
import { Client, DbClient, mapDbClientToClient, mapClientToDbClient } from "@/types";

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
  const dbClient = mapClientToDbClient(client);
  
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
  // Convert camelCase client properties to snake_case for the database
  const dbClientUpdate: Partial<DbClient> = {};
  if (client.firstName) dbClientUpdate.firstname = client.firstName;
  if (client.lastName) dbClientUpdate.lastname = client.lastName;
  if (client.email) dbClientUpdate.email = client.email;
  if (client.phone !== undefined) dbClientUpdate.phone = client.phone;
  if (client.address !== undefined) dbClientUpdate.address = client.address;
  if (client.city !== undefined) dbClientUpdate.city = client.city;
  if (client.postCode !== undefined) dbClientUpdate.postcode = client.postCode;
  if (client.notes !== undefined) dbClientUpdate.notes = client.notes;

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

export const deleteClient = async (id: string): Promise<void> => {
  // Supabase będzie automatycznie usuwać powiązane dane jeśli ustawiono kaskadowe usuwanie w bazie danych
  // Jeżeli nie, musimy usunąć dane ręcznie
  
  // 1. Pobierz wszystkie wizyty klienta i usuń je
  const { error: visitsError } = await supabase
    .from('visits')
    .delete()
    .eq('clientid', id);
  
  if (visitsError) {
    console.error(`Error deleting visits for client with id ${id}:`, visitsError);
    throw visitsError;
  }
  
  // 2. Pobierz wszystkie zwierzęta klienta
  const { data: pets, error: petsError } = await supabase
    .from('pets')
    .select('id')
    .eq('clientid', id);
  
  if (petsError) {
    console.error(`Error fetching pets for client with id ${id}:`, petsError);
    throw petsError;
  }
  
  // 3. Dla każdego zwierzęcia usuń powiązane programy opieki
  if (pets && pets.length > 0) {
    const petIds = pets.map(pet => pet.id);
    
    const { error: careProgramsError } = await supabase
      .from('care_programs')
      .delete()
      .in('petid', petIds);
    
    if (careProgramsError) {
      console.error(`Error deleting care programs for client's pets:`, careProgramsError);
      throw careProgramsError;
    }
    
    // 4. Usuń wszystkie zwierzęta klienta
    const { error: deleteAllPetsError } = await supabase
      .from('pets')
      .delete()
      .eq('clientid', id);
    
    if (deleteAllPetsError) {
      console.error(`Error deleting pets for client with id ${id}:`, deleteAllPetsError);
      throw deleteAllPetsError;
    }
  }
  
  // 5. Usuń klienta
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting client with id ${id}:`, error);
    throw error;
  }
};

export const getRelatedEntitiesCount = async (clientId: string): Promise<{
  petsCount: number;
  visitsCount: number;
  careProgramsCount: number;
}> => {
  // 1. Pobierz liczbę zwierząt
  const { data: pets, error: petsError } = await supabase
    .from('pets')
    .select('id', { count: 'exact' })
    .eq('clientid', clientId);
  
  if (petsError) {
    console.error(`Error counting pets for client ${clientId}:`, petsError);
    throw petsError;
  }
  
  // 2. Pobierz liczbę wizyt
  const { count: visitsCount, error: visitsError } = await supabase
    .from('visits')
    .select('id', { count: 'exact', head: true })
    .eq('clientid', clientId);
  
  if (visitsError) {
    console.error(`Error counting visits for client ${clientId}:`, visitsError);
    throw visitsError;
  }
  
  // 3. Pobierz liczbę programów opieki dla zwierząt klienta
  let careProgramsCount = 0;
  
  if (pets && pets.length > 0) {
    const petIds = pets.map(pet => pet.id);
    
    const { count: programsCount, error: programsError } = await supabase
      .from('care_programs')
      .select('id', { count: 'exact', head: true })
      .in('petid', petIds);
    
    if (programsError) {
      console.error(`Error counting care programs for client's pets:`, programsError);
      throw programsError;
    }
    
    careProgramsCount = programsCount || 0;
  }
  
  return {
    petsCount: pets?.length || 0,
    visitsCount: visitsCount || 0,
    careProgramsCount
  };
};
