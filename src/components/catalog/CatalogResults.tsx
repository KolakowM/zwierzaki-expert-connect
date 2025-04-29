
import { SpecialistCard, Specialist } from "@/components/specialists/SpecialistCard";

interface CatalogResultsProps {
  filteredSpecialists: Specialist[];
  loading: boolean;
}

export function CatalogResults({ filteredSpecialists, loading }: CatalogResultsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (filteredSpecialists.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h3 className="mb-2 text-lg font-medium">Brak wyników</h3>
        <p className="text-muted-foreground">
          Nie znaleziono użytkowników spełniających podane kryteria. Spróbuj zmienić filtry.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredSpecialists.map(specialist => (
        <SpecialistCard specialist={specialist} key={specialist.id} />
      ))}
    </div>
  );
}
