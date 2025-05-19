
// Client types
export interface DbClient {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postcode?: string | null;
  createdat: string; // ISO date string format
  notes?: string | null;
  user_id?: string | null; // Added user_id field from DB
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postCode?: string | null;
  createdAt: Date; // Date object in application
  notes?: string | null;
  userId?: string | null; // Added userId field for app usage
}

// Mapping functions for clients
export const mapDbClientToClient = (dbClient: DbClient): Client => ({
  id: dbClient.id,
  firstName: dbClient.firstname,
  lastName: dbClient.lastname,
  email: dbClient.email,
  phone: dbClient.phone,
  address: dbClient.address,
  city: dbClient.city,
  postCode: dbClient.postcode,
  createdAt: new Date(dbClient.createdat),
  notes: dbClient.notes,
  userId: dbClient.user_id,
});

export const mapClientToDbClient = (client: Omit<Client, 'id' | 'createdAt'>): Omit<DbClient, 'id' | 'createdat'> => ({
  firstname: client.firstName,
  lastname: client.lastName,
  email: client.email,
  phone: client.phone,
  address: client.address,
  city: client.city,
  postcode: client.postCode,
  notes: client.notes,
  user_id: client.userId,
});
