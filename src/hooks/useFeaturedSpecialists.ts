
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
        const { data, error } = await supabase
          .from('specialist_profiles')
          .select(`
            id,
            title,
            description,
            location,
            photo_url,
            specializations,
            user_profiles(first_name, last_name),
            user_roles!inner(role, status)
          `)
          .eq('user_roles.role', 'specialist')
          .eq('user_roles.status', 'zweryfikowany')
          .order('random()')
          .limit(limit);

        if (error) throw error;

        if (data) {
          // Transform the data into the format expected by SpecialistCard
          const transformedData: Specialist[] = data.map(profile => ({
            id: profile.id,
            name: `${profile.user_profiles?.first_name || ''} ${profile.user_profiles?.last_name || ''}`,
            title: profile.title || "Specjalista",
            specializations: profile.specializations || [],
            location: profile.location || "Polska",
            image: profile.photo_url || "https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop",
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
