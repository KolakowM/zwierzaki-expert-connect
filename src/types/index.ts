
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
