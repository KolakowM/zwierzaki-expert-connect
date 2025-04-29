import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpecialistCard, Specialist } from "@/components/specialists/SpecialistCard";
import { CatalogFilter } from "@/components/catalog/CatalogFilter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        setLoading(true);
        console.log('Fetching all users from database');
        
        const { data: userProfiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name');
          
        if (profileError) {
          throw profileError;
        }
        
        if (!userProfiles || userProfiles.length === 0) {
          console.log('No users found');
          setSpecialists([]);
          setFilteredSpecialists([]);
          setLoading(false);
          return;
        }
        
        const userIds = userProfiles.map(profile => profile.id);
        
        let specialistsData: Specialist[] = [];
        
        const { data: specialistProfiles, error: profilesError } = await supabase
          .from('specialist_profiles')
          .select('*')
          .in('id', userIds);
          
        if (profilesError) {
          throw profilesError;
        }
        
        const { data: specialistSpecs, error: specsError } = await supabase
          .from('specialist_specializations')
          .select('specialist_id, specialization_id')
          .in('specialist_id', userIds);
          
        if (specsError) {
          throw specsError;
        }
        
        const specializationsBySpecialist: Record<string, string[]> = {};
        specialistSpecs?.forEach(spec => {
          if (!specializationsBySpecialist[spec.specialist_id]) {
            specializationsBySpecialist[spec.specialist_id] = [];
          }
          specializationsBySpecialist[spec.specialist_id].push(spec.specialization_id);
        });
        
        for (const userProfile of userProfiles) {
          const userId = userProfile.id;
          const specialistProfile = specialistProfiles?.find(p => p.id === userId);
          
          let name = "Użytkownik";
          if (userProfile) {
            name = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
            if (!name) name = "Użytkownik";
          }
          
          specialistsData.push({
            id: userId,
            name: name,
            title: specialistProfile?.title || "Użytkownik systemu",
            specializations: specializationsBySpecialist[userId] || [],
            location: specialistProfile?.location || "Polska",
            image: specialistProfile?.photo_url || "/placeholder.svg",
            rating: 4.5,
            verified: true,
          });
        }
        
        setSpecialists(specialistsData);
        setFilteredSpecialists(specialistsData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać listy użytkowników",
          variant: "destructive"
        });
        setSpecialists([]);
        setFilteredSpecialists([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecialists();
  }, [toast]);

  const handleSearch = () => {
    filterSpecialists({ searchTerm, ...activeFilters });
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    filterSpecialists({ searchTerm, ...filters });
  };

  const filterSpecialists = (filters: any) => {
    let filtered = [...specialists];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        specialist =>
          specialist.name.toLowerCase().includes(term) ||
          specialist.title.toLowerCase().includes(term)
      );
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(
        specialist => specialist.location.toLowerCase().includes(location)
      );
    }

    if (filters.specializations && filters.specializations.length > 0) {
      filtered = filtered.filter(specialist =>
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
        <h1 className="mb-6 text-3xl font-bold">Katalog Użytkowników</h1>
        
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="flex-grow">
            <Input
              placeholder="Szukaj użytkownika, specjalizacji..."
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
                {loading ? "Ładowanie użytkowników..." : `Znaleziono ${filteredSpecialists.length} użytkowników`}
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
                  Nie znaleziono użytkowników spełniających podane kryteria. Spróbuj zmienić filtry.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalog;
