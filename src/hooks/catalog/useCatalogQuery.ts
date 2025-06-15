
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Specialist } from "@/components/specialists/SpecialistCard";
import { useToast } from "@/hooks/use-toast";

export interface CatalogFilters {
  searchTerm?: string;
  location?: string;
  specializations?: string[];
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
  };
  
  // Use React Query to fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ['catalogData', filtersWithDefaults],
    queryFn: async () => {
      try {
        console.log('Fetching catalog data with filters:', filtersWithDefaults);
        
        // Call the RPC function to get specialists with featured functionality
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_catalog_specialists', {
          p_search_term: filtersWithDefaults.searchTerm,
          p_location: filtersWithDefaults.location,
          p_specializations: filtersWithDefaults.specializations,
          p_page: filtersWithDefaults.page,
          p_page_size: filtersWithDefaults.pageSize
        });

        if (rpcError) {
          console.error("Error calling get_catalog_specialists RPC:", rpcError);
          throw rpcError;
        }

        if (!rpcData || rpcData.length === 0) {
          console.log("No specialists found");
          return { 
            specialists: [], 
            totalCount: 0,
            currentPage: filtersWithDefaults.page,
            pageSize: filtersWithDefaults.pageSize
          };
        }

        console.log(`Found ${rpcData.length} specialists from RPC`);

        // Transform RPC data to Specialist format
        const transformedData: Specialist[] = rpcData.map(specialist => ({
          id: specialist.id,
          name: specialist.name,
          title: specialist.title,
          specializations: specialist.specializations || [],
          location: specialist.location,
          image: specialist.image,
          email: specialist.email,
          rating: specialist.rating || 5.0,
          verified: specialist.verified,
          role: specialist.role,
          is_featured: specialist.is_featured
        }));

        // Get total count from first record (all records have the same total_count)
        const totalCount = rpcData.length > 0 ? Number(rpcData[0].total_count) : 0;
        
        console.log("Transformed specialists data:", transformedData.length, "Total count:", totalCount);
        console.log("Featured specialists on this page:", transformedData.filter(s => s.is_featured).length);
        console.log("Specialists displayed alphabetically with featured badges");
        
        return { 
          specialists: transformedData,
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
