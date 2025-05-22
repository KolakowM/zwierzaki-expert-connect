
// Visit types
export interface DbVisit {
  id: string;
  petid: string;
  clientid: string;
  date: string; // ISO date string format
  time?: string | null;
  type: string;
  notes?: string | null;
  recommendations?: string | null;
  followupneeded?: boolean | null;
  followupdate?: string | null; // ISO date string format
  status?: string | null; // Dodane nowe pole status
}

// Definiujemy dozwolone wartości statusu
export type VisitStatus = "Planowana" | "Odbyła się" | "Anulowana" | "Zmiana terminu";

export interface Visit {
  id: string;
  petId: string;
  clientId: string;
  date: Date; // Date object in application
  time?: string | null;
  type: string;
  notes?: string | null;
  recommendations?: string | null;
  followUpNeeded?: boolean | null;
  followUpDate?: Date | null; // Date object in application
  status?: VisitStatus | null; // Dodane pole status z typem VisitStatus
}

// Mapping functions for visits
export const mapDbVisitToVisit = (dbVisit: DbVisit): Visit => ({
  id: dbVisit.id,
  petId: dbVisit.petid,
  clientId: dbVisit.clientid,
  date: new Date(dbVisit.date),
  time: dbVisit.time,
  type: dbVisit.type,
  notes: dbVisit.notes,
  recommendations: dbVisit.recommendations,
  followUpNeeded: dbVisit.followupneeded,
  followUpDate: dbVisit.followupdate ? new Date(dbVisit.followupdate) : null,
  status: dbVisit.status as VisitStatus || "Planowana", // Mapowanie pola status z domyślną wartością
});

export const mapVisitToDbVisit = (visit: Omit<Visit, 'id'>): Omit<DbVisit, 'id'> => ({
  petid: visit.petId,
  clientid: visit.clientId,
  date: visit.date.toISOString(),
  time: visit.time,
  type: visit.type,
  notes: visit.notes,
  recommendations: visit.recommendations,
  followupneeded: visit.followUpNeeded,
  followupdate: visit.followUpDate ? visit.followUpDate.toISOString() : null,
  status: visit.status || "Planowana", // Mapowanie pola status z domyślną wartością
});
