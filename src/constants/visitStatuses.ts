
import { VisitStatus } from "@/types";

// Tablica dozwolonych statusów wizyt
export const ALL_VISIT_STATUSES: VisitStatus[] = [
  "Planowana",
  "Odbyła się",
  "Anulowana",
  "Zmiana terminu",
];

// Domyślny status wizyty
export const DEFAULT_VISIT_STATUS: VisitStatus = "Planowana";

// Pomocnicze funkcje do kolorowania statusów
export const getStatusColor = (status: VisitStatus | null | undefined): string => {
  switch (status) {
    case "Odbyła się":
      return "bg-green-100 text-green-800 border-green-300";
    case "Anulowana":
      return "bg-red-100 text-red-800 border-red-300";
    case "Zmiana terminu":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Planowana":
    default:
      return "bg-blue-100 text-blue-800 border-blue-300";
  }
};
