
import { WithUserId } from './tables';

export type DbClient = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postcode: string | null;
  notes: string | null;
  createdat: string;
  user_id: string | null;
};

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postCode?: string;
  notes?: string;
  createdAt: string;
  userId?: string;
};

export const mapDbClientToClient = (dbClient: DbClient): Client => ({
  id: dbClient.id,
  firstName: dbClient.firstname,
  lastName: dbClient.lastname,
  email: dbClient.email,
  phone: dbClient.phone || undefined,
  address: dbClient.address || undefined,
  city: dbClient.city || undefined,
  postCode: dbClient.postcode || undefined,
  notes: dbClient.notes || undefined,
  createdAt: dbClient.createdat,
  userId: dbClient.user_id || undefined,
});

export const mapClientToDbClient = (client: Omit<Client, 'id' | 'createdAt'>): Omit<DbClient, 'id' | 'createdat'> => ({
  firstname: client.firstName,
  lastname: client.lastName,
  email: client.email,
  phone: client.phone || null,
  address: client.address || null,
  city: client.city || null,
  postcode: client.postCode || null,
  notes: client.notes || null,
  user_id: client.userId || null,
});
