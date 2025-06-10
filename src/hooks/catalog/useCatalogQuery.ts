
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Specialist } from "@/components/specialists/SpecialistCard";
import { AppRole } from "@/services/user/types";
import { useToast } from "@/hooks/use-toast";

export interface CatalogFilters {
  searchTerm?: string;
  location?: string;
  specializations?: string[];
  roles?: AppRole[];
  page?: number;
  pageSize?: number;
}

// Default filter values
export const DEFAULT_PAGE_SIZE = 9;
export const DEFAULT_PAGE = 1;

interface CatalogResponse {
  data: Specialist[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export function useCatalogQuery(filters: CatalogFilters = {}): CatalogResponse & { isLoading: boolean, error: unknown } {
  const { toast } = useToast();
  
  // Apply default values to filters - force specialist role for catalog
  const filtersWithDefaults = {
    page: filters.page || DEFAULT_PAGE,
    pageSize: filters.pageSize || DEFAULT_PAGE_SIZE,
    searchTerm: filters.searchTerm || null,
    location: filters.location || null,
    specializations: filters.specializations?.length ? filters.specializations : null,
    // Always filter for specialists only in catalog
    roles: ['specialist'] as AppRole[],
  };
  
  // Use React Query to fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ['catalogData', filtersWithDefaults],
    queryFn: async () => {
      try {
        console.log('Fetching catalog data with filters:', filtersWithDefaults);
        
        // Step 1: Get verified specialists from user_roles
        const { data: verifiedSpecialists, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'specialist')
          .eq('status', 'zweryfikowany')
          .range(
            (filtersWithDefaults.page - 1) * filtersWithDefaults.pageSize,
            filtersWithDefaults.page * filtersWithDefaults.pageSize - 1
          );

        if (rolesError) {
          console.error("Error fetching verified specialists:", rolesError);
          throw rolesError;
        }

        if (!verifiedSpecialists || verifiedSpecialists.length === 0) {
          console.log("No verified specialists found");
          return { 
            specialists: [], 
            totalCount: 0,
            currentPage: filtersWithDefaults.page,
            pageSize: filtersWithDefaults.pageSize
          };
        }

        console.log(`Found ${verifiedSpecialists.length} verified specialists`);

        // Get total count for pagination
        const { count: totalCount, error: countError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'specialist')
          .eq('status', 'zweryfikowany');

        if (countError) {
          console.error("Error getting total count:", countError);
          throw countError;
        }

        // Extract user IDs
        const userIds = verifiedSpecialists.map(role => role.user_id);

        // Step 2: Get user profiles for these users
        const { data: userProfilesData, error: userProfilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', userIds);

        if (userProfilesError) {
          console.error("Error fetching user profiles:", userProfilesError);
          throw userProfilesError;
        }

        // Step 3: Get specialist profiles for these users
        const { data: specialistProfilesData, error: specialistProfilesError } = await supabase
          .from('specialist_profiles')
          .select('*')
          .in('id', userIds);

        if (specialistProfilesError) {
          console.error("Error fetching specialist profiles:", specialistProfilesError);
        }

        // Step 4: Get specializations for all found specialists
        const { data: specializationsData, error: specializationsError } = await supabase
          .from('specialist_specializations')
          .select(`
            specialist_id,
            specialization_id,
            specializations!inner(id, name)
          `)
          .in('specialist_id', userIds)
          .eq('active', 'yes');

        if (specializationsError) {
          console.error("Error fetching specializations:", specializationsError);
        }

        // Group specializations by specialist
        const specializationsMap = specializationsData?.reduce((acc, item) => {
          if (!acc[item.specialist_id]) {
            acc[item.specialist_id] = [];
          }
          acc[item.specialist_id].push(item.specialization_id);
          return acc;
        }, {} as Record<string, string[]>) || {};

        // Create maps for easier lookup
        const userProfilesMap = userProfilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};

        const specialistProfilesMap = specialistProfilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};
        
        // Transform the data into the format expected by SpecialistCard
        let transformedData: Specialist[] = verifiedSpecialists
          .map(roleData => {
            const userId = roleData.user_id;
            const userProfile = userProfilesMap[userId];
            const specialistProfile = specialistProfilesMap[userId];
            const userSpecializations = specializationsMap[userId] || [];
            
            if (!userProfile) {
              console.warn(`No user profile found for specialist ${userId}`);
              return null;
            }
            
            return {
              id: userId,
              name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Specjalista',
              title: specialistProfile?.title || "Specjalista",
              specializations: userSpecializations,
              location: specialistProfile?.location || userProfile.city || "Polska",
              image: specialistProfile?.photo_url || "https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop",
              email: specialistProfile?.email || userProfile.email,
              rating: 5.0, // Default rating
              verified: true, // All these specialists are verified
              role: 'specialist'
            };
          })
          .filter(Boolean) as Specialist[];

        // Apply additional filters if provided
        if (filtersWithDefaults.searchTerm) {
          const searchLower = filtersWithDefaults.searchTerm.toLowerCase();
          transformedData = transformedData.filter(specialist => 
            specialist.name.toLowerCase().includes(searchLower) ||
            specialist.title.toLowerCase().includes(searchLower)
          );
        }

        if (filtersWithDefaults.location) {
          const locationLower = filtersWithDefaults.location.toLowerCase();
          transformedData = transformedData.filter(specialist => 
            specialist.location.toLowerCase().includes(locationLower)
          );
        }

        if (filtersWithDefaults.specializations) {
          transformedData = transformedData.filter(specialist => 
            specialist.specializations.some(specId => 
              filtersWithDefaults.specializations!.includes(specId)
            )
          );
        }
          
        console.log("Transformed verified specialists data:", transformedData.length);
        
        return { 
          specialists: transformedData,
          totalCount: totalCount || 0,
          currentPage: filtersWithDefaults.page,
          pageSize: filtersWithDefaults.pageSize
        };
      } catch (error) {
        console.error('Error fetching catalog data:', error);
        // Show error toast only on actual errors, not cancellations
        if (error instanceof Error && error.name !== 'CanceledError') {
          toast({
            title: "Błąd",
            description: "Nie udało się pobrać listy specjalistów",
            variant: "destructive"
          });
        }
        throw error;
      }
    },
    staleTime: 60000, // 1 minute before considering data stale
    refetchOnWindowFocus: false // Don't refetch when window regains focus
  });
  
  // Calculate derived values
  const totalPages = data?.totalCount 
    ? Math.max(1, Math.ceil(data.totalCount / filtersWithDefaults.pageSize))
    : 1;
  
  return {
    data: data?.specialists || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || filtersWithDefaults.page,
    pageSize: data?.pageSize || filtersWithDefaults.pageSize,
    totalPages,
    isLoading,
    error
  };
}
