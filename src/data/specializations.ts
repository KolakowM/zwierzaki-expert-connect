
export interface Specialization {
  id: string;
  label: string;
  description?: string;
}

// Słownik wszystkich dostępnych specjalizacji w systemie
export const specializations: Specialization[] = [
  { 
    id: "diet", 
    label: "Dietetyk zwierzęcy",
    description: "Specjalista zajmujący się żywieniem i dietą zwierząt" 
  },
  { 
    id: "behavior", 
    label: "Behawiorysta",
    description: "Specjalista zajmujący się zachowaniem zwierząt" 
  },
  { 
    id: "physio", 
    label: "Fizjoterapeuta",
    description: "Specjalista zajmujący się rehabilitacją i fizjoterapią zwierząt" 
  },
  { 
    id: "training", 
    label: "Trener",
    description: "Specjalista zajmujący się treningiem i szkoleniem zwierząt" 
  },
  { 
    id: "groomer", 
    label: "Groomer",
    description: "Specjalista zajmujący się pielęgnacją i strzyżeniem zwierząt" 
  },
  { 
    id: "vet", 
    label: "Weterynarz",
    description: "Specjalista zajmujący się leczeniem zwierząt" 
  },
  { 
    id: "alternative", 
    label: "Medycyna alternatywna",
    description: "Specjalista zajmujący się alternatywnymi metodami leczenia zwierząt" 
  }
];

// Funkcja pomocnicza do znajdowania etykiety po ID
export function getSpecializationLabel(id: string): string {
  const specialization = specializations.find(spec => spec.id === id);
  return specialization?.label || id;
}

// Funkcja pomocnicza do znajdowania ID po etykiecie
export function getSpecializationId(label: string): string | undefined {
  const specialization = specializations.find(spec => spec.label === label);
  return specialization?.id;
}

// Funkcja do mapowania ID na etykiety
export function mapSpecializationIdsToLabels(ids: string[]): string[] {
  return ids.map(id => getSpecializationLabel(id));
}

// Funkcja do mapowania etykiet na ID
export function mapSpecializationLabelsToIds(labels: string[]): string[] {
  return labels
    .map(label => getSpecializationId(label))
    .filter((id): id is string => id !== undefined);
}
