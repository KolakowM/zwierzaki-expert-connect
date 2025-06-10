
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
        
        // Build the query step by step
        let query = supabase
          .from('user_profiles')
          .select(`
            id,
            first_name,
            last_name,
            email,
            city,
            user_roles!inner(role, status),
            specialist_profiles(
              title,
              location,
              photo_url,
              email
            ),
            specialist_specializations!inner(
              specialization_id,
              active
            )
          `)
          .eq('user_roles.role', 'specialist')
          .eq('user_roles.status', 'zweryfikowany')
          .eq('specialist_specializations.active', 'yes');

        // Apply search filter if provided
        if (filtersWithDefaults.searchTerm) {
          const searchTerm = filtersWithDefaults.searchTerm.toLowerCase();
          query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,specialist_profiles.title.ilike.%${searchTerm}%`);
        }

        // Apply location filter if provided
        if (filtersWithDefaults.location) {
          const locationTerm = filtersWithDefaults.location.toLowerCase();
          query = query.or(`city.ilike.%${locationTerm}%,specialist_profiles.location.ilike.%${locationTerm}%`);
        }

        // Apply specialization filter if provided
        if (filtersWithDefaults.specializations) {
          query = query.in('specialist_specializations.specialization_id', filtersWithDefaults.specializations);
        }

        // First get total count for pagination
        const countQuery = query;
        const { count: totalCount, error: countError } = await countQuery
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.error("Error getting total count:", countError);
          throw countError;
        }

        // Now get the actual data with pagination
        const { data: specialistsData, error: specialistsError } = await query
          .range(
            (filtersWithDefaults.page - 1) * filtersWithDefaults.pageSize,
            filtersWithDefaults.page * filtersWithDefaults.pageSize - 1
          );

        if (specialistsError) {
          console.error("Error fetching specialists:", specialistsError);
          throw specialistsError;
        }

        if (!specialistsData || specialistsData.length === 0) {
          console.log("No specialists found");
          return { 
            specialists: [], 
            totalCount: totalCount || 0,
            currentPage: filtersWithDefaults.page,
            pageSize: filtersWithDefaults.pageSize
          };
        }

        console.log(`Found ${specialistsData.length} specialists`);

        // Transform the data into the format expected by SpecialistCard
        const transformedData: Specialist[] = specialistsData
          .map(userData => {
            const userProfile = userData;
            const specialistProfile = userData.specialist_profiles?.[0];
            const userSpecializations = userData.specialist_specializations
              ?.filter(spec => spec.active === 'yes')
              ?.map(spec => spec.specialization_id) || [];
            
            return {
              id: userData.id,
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
          
        console.log("Transformed specialists data:", transformedData.length);
        
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
