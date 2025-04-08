
// Visit types
export interface DbVisit {
  id: string;
  petid: string;
  clientid: string;
  date: string;
  time?: string | null;
  type: string;
  notes?: string | null;
  recommendations?: string | null;
  followupneeded?: boolean | null;
  followupdate?: string | null;
}

export interface Visit {
  id: string;
  petId: string;
  clientId: string;
  date: string | Date;
  time?: string | null;
  type: string;
  notes?: string | null;
  recommendations?: string | null;
  followUpNeeded?: boolean | null;
  followUpDate?: string | Date | null;
}

// Mapping functions for visits
export const mapDbVisitToVisit = (dbVisit: DbVisit): Visit => ({
  id: dbVisit.id,
  petId: dbVisit.petid,
  clientId: dbVisit.clientid,
  date: dbVisit.date,
  time: dbVisit.time,
  type: dbVisit.type,
  notes: dbVisit.notes,
  recommendations: dbVisit.recommendations,
  followUpNeeded: dbVisit.followupneeded,
  followUpDate: dbVisit.followupdate,
});

export const mapVisitToDbVisit = (visit: Omit<Visit, 'id'>): Omit<DbVisit, 'id'> => ({
  petid: visit.petId,
  clientid: visit.clientId,
  date: typeof visit.date === 'string' ? visit.date : visit.date.toISOString(),
  time: visit.time,
  type: visit.type,
  notes: visit.notes,
  recommendations: visit.recommendations,
  followupneeded: visit.followUpNeeded,
  followupdate: visit.followUpDate instanceof Date ? visit.followUpDate.toISOString() : visit.followUpDate,
});
