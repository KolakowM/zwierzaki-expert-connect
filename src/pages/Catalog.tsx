
import { useState, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { CatalogFilter } from "@/components/catalog/CatalogFilter";
import { CatalogResults } from "@/components/catalog/CatalogResults";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { CatalogFilters, useCatalogQuery } from "@/hooks/catalog/useCatalogQuery";
import { PaginationControls } from "@/components/catalog/PaginationControls";
import { ItemsPerPageSelect } from "@/components/catalog/ItemsPerPageSelect";
import { useTranslation } from "react-i18next";

const Catalog = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<CatalogFilters>({});
  const { 
    data: specialists, 
    isLoading, 
    totalCount,
    currentPage,
    pageSize,
    totalPages 
  } = useCatalogQuery(filters);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm: searchTerm || undefined, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((newFilters: CatalogFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setFilters(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

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
                {isLoading 
                  ? t('common.loading')
                  : t('catalog.results_count', { count: totalCount })
                }
              </p>
              
              <ItemsPerPageSelect 
                pageSize={pageSize} 
                onPageSizeChange={handlePageSizeChange} 
              />
            </div>
            
            <CatalogResults 
              filteredSpecialists={specialists}
              loading={isLoading}
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
