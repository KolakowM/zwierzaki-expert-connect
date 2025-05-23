
import { SpecialistCard, Specialist } from "@/components/specialists/SpecialistCard";
import { useTranslation } from "react-i18next";

interface CatalogResultsProps {
  filteredSpecialists: Specialist[];
  loading: boolean;
}

export function CatalogResults({ filteredSpecialists, loading }: CatalogResultsProps) {
  const { t } = useTranslation();
  
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
        <h3 className="mb-2 text-lg font-medium">{t('catalog.no_results')}</h3>
        <p className="text-muted-foreground">
          {t('catalog.no_results')}
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
