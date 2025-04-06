
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
  
  return (data || []).map(mapDbClientToClient);
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
  const { data, error } = await supabase
    .from('clients')
    .insert([mapClientToDbClient(client)])
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
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting client with id ${id}:`, error);
    throw error;
  }
};
