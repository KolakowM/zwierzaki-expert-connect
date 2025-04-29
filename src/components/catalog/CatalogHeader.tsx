
interface CatalogHeaderProps {
  loading: boolean;
  resultsCount: number;
}

export function CatalogHeader({ loading, resultsCount }: CatalogHeaderProps) {
  return (
    <div className="mb-4">
      <p className="text-muted-foreground">
        {loading ? "Ładowanie użytkowników..." : `Znaleziono ${resultsCount} użytkowników`}
      </p>
    </div>
  );
}
