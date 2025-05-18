
export * from './client';
export * from './pet';
export * from './visit';
export * from './care-program';

// Add social media links type
export interface SocialMediaLinks {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  twitch?: string | null;
  [key: string]: string | null | undefined;
}

// Helper function to map database client to Client type
export function mapDbClientToClient(dbClient: any): Client {
  return {
    id: dbClient.id,
    firstName: dbClient.firstname || dbClient.firstName || "",
    lastName: dbClient.lastname || dbClient.lastName || "",
    email: dbClient.email || "",
    phone: dbClient.phone || "",
    address: dbClient.address || "",
    city: dbClient.city || "",
    postCode: dbClient.postcode || dbClient.postCode || "",
    notes: dbClient.notes || "",
    createdAt: dbClient.createdat || dbClient.created_at || new Date().toISOString(),
    user_id: dbClient.user_id
  };
}

// Helper function to map Client type to database format
export function mapClientToDbClient(client: Partial<Client>): any {
  const dbClient: any = {};
  
  if (client.firstName !== undefined) dbClient.firstname = client.firstName;
  if (client.lastName !== undefined) dbClient.lastname = client.lastName;
  if (client.email !== undefined) dbClient.email = client.email;
  if (client.phone !== undefined) dbClient.phone = client.phone;
  if (client.address !== undefined) dbClient.address = client.address;
  if (client.city !== undefined) dbClient.city = client.city;
  if (client.postCode !== undefined) dbClient.postcode = client.postCode;
  if (client.notes !== undefined) dbClient.notes = client.notes;
  if (client.user_id !== undefined) dbClient.user_id = client.user_id;
  
  return dbClient;
}

// Helper function to map database visit to Visit type
export function mapDbVisitToVisit(dbVisit: any): Visit {
  return {
    id: dbVisit.id,
    date: dbVisit.date,
    time: dbVisit.time || "",
    clientId: dbVisit.clientid,
    petId: dbVisit.petid,
    notes: dbVisit.notes,
    status: dbVisit.status || "scheduled",
    type: dbVisit.type,
    followUp: dbVisit.followup,
    followUpNeeded: dbVisit.followupneeded || false,
    followUpDate: dbVisit.followupdate,
    recommendations: dbVisit.recommendations,
    createdAt: dbVisit.createdat || dbVisit.created_at || new Date().toISOString(),
    user_id: dbVisit.user_id
  };
}
