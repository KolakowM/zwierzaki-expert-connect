
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
  
  // Apply default values to filters
  const filtersWithDefaults = {
    page: filters.page || DEFAULT_PAGE,
    pageSize: filters.pageSize || DEFAULT_PAGE_SIZE,
    searchTerm: filters.searchTerm || null,
    location: filters.location || null,
    specializations: filters.specializations?.length ? filters.specializations : null,
    roles: filters.roles?.length ? filters.roles : null,
  };
  
  // Use React Query to fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ['catalogData', filtersWithDefaults],
    queryFn: async () => {
      try {
        console.log('Fetching catalog data with filters:', filtersWithDefaults);
        
        // Call our new Supabase function
        const { data, error } = await supabase
          .rpc('get_catalog_data', {
            p_search_term: filtersWithDefaults.searchTerm,
            p_location: filtersWithDefaults.location,
            p_specializations: filtersWithDefaults.specializations,
            p_roles: filtersWithDefaults.roles,
            p_page: filtersWithDefaults.page,
            p_page_size: filtersWithDefaults.pageSize
          });
          
        if (error) throw error;
        
        // If no data, return empty array
        if (!data || data.length === 0) {
          return { 
            specialists: [], 
            totalCount: 0,
            currentPage: filtersWithDefaults.page,
            pageSize: filtersWithDefaults.pageSize
          };
        }
        
        // Our database function returns totalCount with each row, take it from the first row
        const totalCount = data[0].total_count;
        
        // Transform data to match the expected Specialist format
        const specialists: Specialist[] = data.map(item => ({
          id: item.id,
          name: item.name,
          title: item.title,
          specializations: item.specializations,
          location: item.location,
          image: item.image,
          email: item.email,
          rating: item.rating || 0,
          verified: item.verified,
          role: item.role
        }));
        
        return { 
          specialists,
          totalCount,
          currentPage: filtersWithDefaults.page,
          pageSize: filtersWithDefaults.pageSize
        };
      } catch (error) {
        console.error('Error fetching catalog data:', error);
        // Show error toast only on actual errors, not cancellations
        if (error instanceof Error && error.name !== 'CanceledError') {
          toast({
            title: "Błąd",
            description: "Nie udało się pobrać listy użytkowników",
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
