// Export all types from separate files
export * from './client';
export * from './pet';
export * from './visit';
export * from './care-program';
export * from './tables';

// Define social media types for consistency
export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  twitch?: string;
}

export interface SpecialistProfile {
  id: string;
  title?: string;
  description?: string;
  specializations?: string[];
  services?: string[];
  education?: string[];
  experience?: string;
  location?: string;
  phone_number?: string;
  website?: string;
  photo_url?: string;
  social_media?: SocialMediaLinks;
  updated_at?: string;
}

// Define the DbClient type to match the database schema
export interface DbClient {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  notes?: string;
  createdat: string; // ISO date string
  user_id: string;   // Added the user_id field
}

// Define the Client type used in the application
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postCode?: string;
  notes?: string;
  createdAt: Date;
  userId?: string;  // Added the userId field (optional for compatibility with existing code)
}

// Map database client to application client
export function mapDbClientToClient(dbClient: DbClient): Client {
  return {
    id: dbClient.id,
    firstName: dbClient.firstname,
    lastName: dbClient.lastname,
    email: dbClient.email,
    phone: dbClient.phone,
    address: dbClient.address,
    city: dbClient.city,
    postCode: dbClient.postcode,
    notes: dbClient.notes,
    createdAt: new Date(dbClient.createdat),
    userId: dbClient.user_id
  };
}

// Map application client to database client
export function mapClientToDbClient(client: Omit<Client, 'id' | 'createdAt'>): Omit<DbClient, 'id' | 'createdat' | 'user_id'> {
  return {
    firstname: client.firstName,
    lastname: client.lastName,
    email: client.email,
    phone: client.phone,
    address: client.address,
    city: client.city,
    postcode: client.postCode,
    notes: client.notes
  };
}
