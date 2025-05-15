
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
        
        // Query to get verified specialists
        const { data: userRolesData, error: userRolesError } = await supabase
          .from('user_roles')
          .select(`
            user_id,
            user_profiles!inner(first_name, last_name, email),
            specialist_profiles!inner(
              id, title, description, location, photo_url, specializations
            )
          `)
          .eq('role', 'specialist')
          .eq('status', 'zweryfikowany')
          .order('random()')
          .limit(limit);

        if (userRolesError) throw userRolesError;

        if (userRolesData) {
          // Transform the data into the format expected by SpecialistCard
          const transformedData: Specialist[] = userRolesData.map(entry => ({
            id: entry.specialist_profiles.id,
            name: `${entry.user_profiles.first_name} ${entry.user_profiles.last_name}`,
            title: entry.specialist_profiles.title || "Specjalista",
            specializations: entry.specialist_profiles.specializations || [],
            location: entry.specialist_profiles.location || "Polska",
            image: entry.specialist_profiles.photo_url || "https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop",
            rating: 5.0, // Default rating
            verified: true, // Since we filtered for verified specialists
            role: 'specialist'
          }));
          
          setSpecialists(transformedData);
        }
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
