
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { CatalogFilter } from "@/components/catalog/CatalogFilter";
import { CatalogResults } from "@/components/catalog/CatalogResults";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { useCatalogData, CatalogFilters } from "@/hooks/useCatalogData";

const Catalog = () => {
  const [activeFilters, setActiveFilters] = useState<CatalogFilters>({});
  const { filteredSpecialists, loading, filterSpecialists } = useCatalogData();

  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...activeFilters, searchTerm };
    setActiveFilters(newFilters);
    filterSpecialists(newFilters);
  };

  const handleFilterChange = (filters: CatalogFilters) => {
    const newFilters = { ...activeFilters, ...filters };
    setActiveFilters(newFilters);
    filterSpecialists(newFilters);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <CatalogHeader onSearch={handleSearch} />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside className="md:col-span-1">
            <CatalogFilter onFilterChange={handleFilterChange} />
          </aside>
          
          <div className="md:col-span-3">
            <div className="mb-4">
              <p className="text-muted-foreground">
                {loading ? "Ładowanie użytkowników..." : `Znaleziono ${filteredSpecialists.length} użytkowników`}
              </p>
            </div>
            
            <CatalogResults 
              filteredSpecialists={filteredSpecialists}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalog;
