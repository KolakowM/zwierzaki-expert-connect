
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { CatalogFilter } from "@/components/catalog/CatalogFilter";
import { CatalogResults } from "@/components/catalog/CatalogResults";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { useCatalogData, CatalogFilters } from "@/hooks/useCatalogData";
import { PaginationControls } from "@/components/catalog/PaginationControls";
import { ItemsPerPageSelect } from "@/components/catalog/ItemsPerPageSelect";

const Catalog = () => {
  const [activeFilters, setActiveFilters] = useState<CatalogFilters>({});
  const { 
    filteredSpecialists, 
    loading, 
    filterSpecialists, 
    currentPage, 
    setCurrentPage, 
    pageSize, 
    setPageSize, 
    totalCount, 
    totalPages 
  } = useCatalogData();

  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...activeFilters, searchTerm, page: 1 };
    setActiveFilters(newFilters);
    filterSpecialists(newFilters);
  };

  const handleFilterChange = (filters: CatalogFilters) => {
    const newFilters = { ...activeFilters, ...filters, page: 1 };
    setActiveFilters(newFilters);
    filterSpecialists(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...activeFilters, page };
    setActiveFilters(newFilters);
    filterSpecialists(newFilters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newFilters = { ...activeFilters, pageSize: newPageSize, page: 1 };
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
            <div className="mb-4 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <p className="text-muted-foreground">
                {loading 
                  ? "Ładowanie użytkowników..." 
                  : `Znaleziono ${totalCount} użytkowników`
                }
              </p>
              
              <ItemsPerPageSelect 
                pageSize={pageSize} 
                onPageSizeChange={handlePageSizeChange} 
              />
            </div>
            
            <CatalogResults 
              filteredSpecialists={filteredSpecialists}
              loading={loading}
            />
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <PaginationControls 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalog;
