
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpecialistCard, Specialist } from "@/components/specialists/SpecialistCard";
import { CatalogFilter } from "@/components/catalog/CatalogFilter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppRole } from "@/services/userService";

// Define a more comprehensive user type to handle all user types
interface CatalogUser {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  location: string;
  image: string;
  rating?: number;
  verified: boolean;
  role: AppRole;
}

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [users, setUsers] = useState<CatalogUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CatalogUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Fetching all users from database');
        
        // 1. Fetch all user profiles
        const { data: userProfiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name, email');
          
        if (profileError) {
          throw profileError;
        }
        
        if (!userProfiles || userProfiles.length === 0) {
          console.log('No users found');
          setUsers([]);
          setFilteredUsers([]);
          setLoading(false);
          return;
        }
        
        // 2. Get all user IDs to fetch related data
        const userIds = userProfiles.map(profile => profile.id);
        
        // 3. Fetch user roles to identify specialists, admins, etc.
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role, status')
          .in('user_id', userIds);
          
        if (rolesError) {
          throw rolesError;
        }
        
        // 4. Fetch specialist profiles for users with specialist role
        const { data: specialistProfiles, error: specialistsError } = await supabase
          .from('specialist_profiles')
          .select('*')
          .in('id', userIds);
          
        if (specialistsError) {
          throw specialistsError;
        }
        
        // 5. Fetch specialist specializations
        const { data: specialistSpecs, error: specsError } = await supabase
          .from('specialist_specializations')
          .select('specialist_id, specialization_id')
          .in('specialist_id', userIds);
          
        if (specsError) {
          throw specsError;
        }
        
        // Create maps for easier lookup
        const roleMap = new Map();
        userRoles?.forEach(role => {
          roleMap.set(role.user_id, {role: role.role, status: role.status});
        });
        
        const specializationsBySpecialist: Record<string, string[]> = {};
        specialistSpecs?.forEach(spec => {
          if (!specializationsBySpecialist[spec.specialist_id]) {
            specializationsBySpecialist[spec.specialist_id] = [];
          }
          specializationsBySpecialist[spec.specialist_id].push(spec.specialization_id);
        });
        
        // 6. Combine all data for each user
        const catalogUsers: CatalogUser[] = userProfiles.map(userProfile => {
          const userId = userProfile.id;
          const userRole = roleMap.get(userId) || { role: 'user', status: 'niezweryfikowany' };
          const specialistProfile = specialistProfiles?.find(p => p.id === userId);
          
          let name = "Użytkownik";
          if (userProfile) {
            name = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
            if (!name) name = "Użytkownik";
          }
          
          // Define title based on role and specialist profile
          let title = "Użytkownik systemu";
          if (userRole.role === 'specialist' && specialistProfile?.title) {
            title = specialistProfile.title;
          } else if (userRole.role === 'admin') {
            title = "Administrator";
          }
          
          return {
            id: userId,
            name: name,
            title: title,
            specializations: userRole.role === 'specialist' ? 
              specializationsBySpecialist[userId] || [] : [],
            location: specialistProfile?.location || "Polska",
            image: specialistProfile?.photo_url || "/placeholder.svg",
            rating: 4.5, // Default rating
            verified: userRole.status === 'verified',
            role: userRole.role as AppRole
          };
        });
        
        setUsers(catalogUsers);
        setFilteredUsers(catalogUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać listy użytkowników",
          variant: "destructive"
        });
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  const handleSearch = () => {
    filterUsers({ searchTerm, ...activeFilters });
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    filterUsers({ searchTerm, ...filters });
  };

  const filterUsers = (filters: any) => {
    let filtered = [...users];

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(term) ||
          user.title.toLowerCase().includes(term)
      );
    }

    // Filter by user role if specified
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Filter by location (mainly for specialists)
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(
        user => user.location.toLowerCase().includes(location)
      );
    }

    // Filter by specializations (only applicable to specialists)
    if (filters.specializations && filters.specializations.length > 0) {
      filtered = filtered.filter(user =>
        user.role === 'specialist' && 
        Array.isArray(user.specializations) && 
        user.specializations.some(specId =>
          filters.specializations.includes(specId)
        )
      );
    }

    setFilteredUsers(filtered);
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
                {loading ? "Ładowanie użytkowników..." : `Znaleziono ${filteredUsers.length} użytkowników`}
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200"></div>
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map(user => (
                  <SpecialistCard specialist={user} key={user.id} />
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
