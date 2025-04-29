
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { CatalogFilter } from "@/components/catalog/CatalogFilter";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { CatalogResults } from "@/components/catalog/CatalogResults";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { useCatalogData } from "@/hooks/useCatalogData";

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const { filteredUsers, setFilteredUsers, loading, filterUsers } = useCatalogData();

  const handleSearch = () => {
    const filtered = filterUsers({ searchTerm, ...activeFilters });
    setFilteredUsers(filtered);
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    const filtered = filterUsers({ searchTerm, ...filters });
    setFilteredUsers(filtered);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Katalog Użytkowników</h1>
        
        <CatalogSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside className="md:col-span-1">
            <CatalogFilter onFilterChange={handleFilterChange} />
          </aside>
          
          <div className="md:col-span-3">
            <CatalogHeader 
              loading={loading} 
              resultsCount={filteredUsers.length} 
            />
            
            <CatalogResults 
              loading={loading}
              filteredUsers={filteredUsers}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalog;
