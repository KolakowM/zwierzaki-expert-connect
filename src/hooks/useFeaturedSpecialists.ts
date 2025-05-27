
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
        console.log("Fetching featured specialists with limit:", limit);
        
        // First, try to get specialists with "Zawodowiec" package
        const { data: zawodowiecPackage, error: packageError } = await supabase
          .from('packages')
          .select('id')
          .eq('name', 'Zawodowiec')
          .eq('is_active', true)
          .single();

        if (packageError) {
          console.log("No Zawodowiec package found:", packageError);
        }

        let specialistIds: string[] = [];

        if (zawodowiecPackage) {
          console.log("Found Zawodowiec package:", zawodowiecPackage.id);
          
          // Get active subscriptions for this package
          const { data: subscriptionsData, error: subscriptionsError } = await supabase
            .from('user_subscriptions')
            .select('user_id')
            .eq('status', 'active')
            .eq('package_id', zawodowiecPackage.id)
            .limit(limit);

          if (subscriptionsError) {
            console.error("Error fetching subscriptions:", subscriptionsError);
          } else {
            specialistIds = subscriptionsData?.map(sub => sub.user_id) || [];
            console.log("Found specialists with Zawodowiec package:", specialistIds.length);
          }
        }

        // If no specialists with Zawodowiec package, fall back to verified specialists
        if (specialistIds.length === 0) {
          console.log("Falling back to verified specialists");
          
          const { data: verifiedSpecialists, error: verifiedError } = await supabase
            .from('user_roles')
            .select('user_id')
            .eq('role', 'specialist')
            .eq('status', 'zweryfikowany')
            .limit(limit);

          if (verifiedError) {
            console.error("Error fetching verified specialists:", verifiedError);
            throw verifiedError;
          }

          specialistIds = verifiedSpecialists?.map(item => item.user_id) || [];
          console.log("Found verified specialists:", specialistIds.length);
        }

        if (specialistIds.length === 0) {
          console.log("No specialists found, setting empty array");
          setSpecialists([]);
          return;
        }

        // Get specialist profiles for these IDs
        const { data: profilesData, error: profilesError } = await supabase
          .from('specialist_profiles')
          .select(`
            id, 
            title, 
            description, 
            location, 
            photo_url, 
            specializations
          `)
          .in('id', specialistIds)
          .limit(limit);
          
        if (profilesError) {
          console.error("Error fetching specialist profiles:", profilesError);
          throw profilesError;
        }
        
        // Get user profiles data separately
        const { data: userProfilesData, error: userProfilesError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name')
          .in('id', specialistIds);
          
        if (userProfilesError) {
          console.error("Error fetching user profiles:", userProfilesError);
          throw userProfilesError;
        }
        
        // Create a mapping for easy lookup
        const userProfilesMap = userProfilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};
        
        // Transform the data into the format expected by SpecialistCard
        if (profilesData) {
          const transformedData: Specialist[] = profilesData.map(profile => {
            const userProfile = userProfilesMap[profile.id] || {};
            
            return {
              id: profile.id,
              name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Specjalista',
              title: profile.title || "Specjalista",
              specializations: profile.specializations || [],
              location: profile.location || "Polska",
              image: profile.photo_url || "https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop",
              rating: 5.0, // Default rating
              verified: true, // Since we filtered for verified specialists or package holders
              role: 'specialist'
            };
          });
          
          console.log("Transformed specialists data:", transformedData.length);
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
