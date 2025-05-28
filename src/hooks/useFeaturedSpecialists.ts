
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Specialist } from "@/components/specialists/SpecialistCard";

export function useFeaturedSpecialists(limit = 12) {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedSpecialists = async () => {
      try {
        setLoading(true);
        console.log("Fetching featured specialists with Zawodowiec package subscriptions, limit:", limit);
        
        // Get specialists with active "Zawodowiec" package subscriptions using a single optimized query
        const { data: featuredData, error: featuredError } = await supabase
          .from('user_subscriptions')
          .select(`
            user_id,
            packages!inner(
              id,
              name,
              can_access_carousel
            ),
            user_profiles!inner(
              id,
              first_name,
              last_name,
              email
            ),
            specialist_profiles(
              id,
              title,
              description,
              location,
              photo_url,
              email,
              phone_number,
              website
            ),
            user_roles!inner(
              role,
              status
            )
          `)
          .eq('status', 'active')
          .eq('packages.name', 'Zawodowiec')
          .eq('packages.can_access_carousel', true)
          .eq('packages.is_active', true)
          .eq('user_roles.role', 'specialist')
          .gte('end_date', new Date().toISOString())
          .limit(limit);

        if (featuredError) {
          console.error("Error fetching featured specialists:", featuredError);
          throw featuredError;
        }

        if (!featuredData || featuredData.length === 0) {
          console.log("No specialists found with active Zawodowiec package subscriptions");
          setSpecialists([]);
          return;
        }

        console.log(`Found ${featuredData.length} specialists with active Zawodowiec subscriptions`);

        // Get specializations for all found specialists
        const specialistIds = featuredData.map(item => item.user_id);
        
        const { data: specializationsData, error: specializationsError } = await supabase
          .from('specialist_specializations')
          .select(`
            specialist_id,
            specialization_id,
            specializations!inner(id, name)
          `)
          .in('specialist_id', specialistIds)
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
        
        // Transform the data into the format expected by SpecialistCard
        const transformedData: Specialist[] = featuredData
          .map(item => {
            const userProfile = item.user_profiles;
            const specialistProfile = item.specialist_profiles;
            const userSpecializations = specializationsMap[item.user_id] || [];
            
            if (!userProfile) {
              console.warn(`No user profile found for specialist ${item.user_id}`);
              return null;
            }
            
            return {
              id: item.user_id,
              name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Specjalista',
              title: specialistProfile?.title || "Specjalista",
              specializations: userSpecializations,
              location: specialistProfile?.location || "Polska",
              image: specialistProfile?.photo_url || "https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop",
              email: specialistProfile?.email || userProfile.email,
              rating: 5.0, // Default rating
              verified: true, // All specialists with Zawodowiec package are considered verified
              role: 'specialist'
            };
          })
          .filter(Boolean) as Specialist[];
          
        console.log("Transformed specialists data:", transformedData.length);
        console.log("Sample specialist with specializations:", transformedData[0]);
        setSpecialists(transformedData);
        
      } catch (err) {
        console.error("Error fetching featured specialists:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch specialists"));
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać specjalistów. Spróbuj ponownie później.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSpecialists();
  }, [toast, limit]);

  return { specialists, loading, error };
}
