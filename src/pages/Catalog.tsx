
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpecialistCard, Specialist } from "@/components/specialists/SpecialistCard";
import { CatalogFilter } from "@/components/catalog/CatalogFilter";
import { supabase } from "@/integrations/supabase/client";

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch specialists from the database
  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        setLoading(true);
        console.log('Fetching specialists from database');
        
        // Get all specialist profiles
        const { data, error } = await supabase
          .from('specialist_profiles')
          .select('*');
          
        if (error) throw error;
        
        // For each specialist, fetch their specializations
        const specialistsWithData = await Promise.all((data || []).map(async (specialist: any) => {
          // Try to get user's name from user_profiles
          let name = "Specjalista";
          try {
            const { data: userData } = await supabase
              .from('user_profiles')
              .select('first_name, last_name')
              .eq('id', specialist.id)
              .maybeSingle();
              
            if (userData) {
              name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
              if (!name) name = "Specjalista";
            }
          } catch (e) {
            console.error('Error fetching user profile:', e);
          }
          
          // Fetch specializations for this specialist
          let specializations: string[] = [];
          try {
            const { data: specData } = await supabase
              .from('specialist_specializations')
              .select('specialization_id')
              .eq('specialist_id', specialist.id);
              
            if (specData && specData.length > 0) {
              specializations = specData.map(item => item.specialization_id);
            }
          } catch (e) {
            console.error('Error fetching specializations:', e);
          }
          
          return {
            id: specialist.id,
            name: name,
            title: specialist.title || "Specjalista",
            specializations: specializations,
            location: specialist.location || "Polska",
            image: specialist.photo_url || "/placeholder.svg",
            rating: 4.8, // Sample rating
            verified: true, // Sample verification status
          };
        }));
        
        setSpecialists(specialistsWithData);
        setFilteredSpecialists(specialistsWithData);
      } catch (error) {
        console.error('Error fetching specialists:', error);
        // Fallback to empty array
        setSpecialists([]);
        setFilteredSpecialists([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecialists();
  }, []);

  const handleSearch = () => {
    filterSpecialists({ searchTerm, ...activeFilters });
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    filterSpecialists({ searchTerm, ...filters });
  };

  const filterSpecialists = (filters: any) => {
    let filtered = [...specialists];

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        specialist =>
          specialist.name.toLowerCase().includes(term) ||
          specialist.title.toLowerCase().includes(term)
      );
    }

    // Filter by location
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(
        specialist => specialist.location.toLowerCase().includes(location)
      );
    }

    // Filter by specializations using IDs
    if (filters.specializations && filters.specializations.length > 0) {
      filtered = filtered.filter(specialist =>
        // Make sure specialist.specializations is an array and check if it contains any of the selected IDs
        Array.isArray(specialist.specializations) && specialist.specializations.some(specId =>
          filters.specializations.includes(specId)
        )
      );
    }

    setFilteredSpecialists(filtered);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Katalog Specjalistów</h1>
        
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="flex-grow">
            <Input
              placeholder="Szukaj specjalisty, specjalizacji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={handleSearch} className="md:w-auto">
            Szukaj
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <aside className="md:col-span-1">
            <CatalogFilter onFilterChange={handleFilterChange} />
          </aside>
          
          <div className="md:col-span-3">
            <div className="mb-4">
              <p className="text-muted-foreground">
                {loading ? "Ładowanie specjalistów..." : `Znaleziono ${filteredSpecialists.length} specjalistów`}
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200"></div>
                ))}
              </div>
            ) : filteredSpecialists.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSpecialists.map(specialist => (
                  <SpecialistCard specialist={specialist} key={specialist.id} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <h3 className="mb-2 text-lg font-medium">Brak wyników</h3>
                <p className="text-muted-foreground">
                  Nie znaleziono specjalistów spełniających podane kryteria. Spróbuj zmienić filtry.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Catalog;
