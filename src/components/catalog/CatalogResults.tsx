
import { SpecialistCard } from "@/components/specialists/SpecialistCard";

interface CatalogUser {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  location: string;
  image: string;
  rating?: number;
  verified: boolean;
  role: string;
}

interface CatalogResultsProps {
  loading: boolean;
  filteredUsers: CatalogUser[];
}

export function CatalogResults({ loading, filteredUsers }: CatalogResultsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (filteredUsers.length === 0) {
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
      {filteredUsers.map(user => (
        <SpecialistCard specialist={user} key={user.id} />
      ))}
    </div>
  );
}
