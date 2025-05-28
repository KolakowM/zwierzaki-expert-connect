
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
        
        // First, try to get specialists with active "Zawodowiec" package subscriptions
        const { data: zawodowiecPackage, error: packageError } = await supabase
          .from('packages')
          .select('id')
          .eq('name', 'Zawodowiec')
          .eq('is_active', true)
          .single();

        let specialistIds: string[] = [];

        if (zawodowiecPackage && !packageError) {
          console.log("Found Zawodowiec package:", zawodowiecPackage.id);
          
          // Get users with active subscriptions for this package
          const { data: subscriptionsData, error: subscriptionsError } = await supabase
            .from('user_subscriptions')
            .select('user_id')
            .eq('status', 'active')
            .eq('package_id', zawodowiecPackage.id)
            .gte('end_date', new Date().toISOString())
            .limit(limit);

          if (!subscriptionsError && subscriptionsData) {
            specialistIds = subscriptionsData.map(sub => sub.user_id);
            console.log("Found specialists with active Zawodowiec subscriptions:", specialistIds.length);
          }
        } else {
          console.log("Zawodowiec package not found or inactive:", packageError);
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

        // Get user profiles data
        const { data: userProfilesData, error: userProfilesError } = await supabase
          .from('user_profiles')
          .select('id, first_name, last_name, email')
          .in('id', specialistIds);
          
        if (userProfilesError) {
          console.error("Error fetching user profiles:", userProfilesError);
          throw userProfilesError;
        }
        
        // Get specialist profiles data
        const { data: profilesData, error: profilesError } = await supabase
          .from('specialist_profiles')
          .select(`
            id, 
            title, 
            description, 
            location, 
            photo_url,
            email,
            phone_number,
            website
          `)
          .in('id', specialistIds);
          
        if (profilesError) {
          console.error("Error fetching specialist profiles:", profilesError);
          throw profilesError;
        }

        // Get active specializations for each specialist
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

        // Create mappings for easy lookup
        const userProfilesMap = userProfilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};

        const profilesMap = profilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};

        // Group specializations by specialist
        const specializationsMap = specializationsData?.reduce((acc, item) => {
          if (!acc[item.specialist_id]) {
            acc[item.specialist_id] = [];
          }
          acc[item.specialist_id].push(item.specialization_id);
          return acc;
        }, {} as Record<string, string[]>) || {};
        
        // Transform the data into the format expected by SpecialistCard
        const transformedData: Specialist[] = specialistIds
          .map(id => {
            const userProfile = userProfilesMap[id];
            const specialistProfile = profilesMap[id];
            const userSpecializations = specializationsMap[id] || [];
            
            if (!userProfile) {
              console.warn(`No user profile found for specialist ${id}`);
              return null;
            }
            
            return {
              id: id,
              name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Specjalista',
              title: specialistProfile?.title || "Specjalista",
              specializations: userSpecializations,
              location: specialistProfile?.location || "Polska",
              image: specialistProfile?.photo_url || "https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop",
              email: specialistProfile?.email || userProfile.email,
              rating: 5.0, // Default rating
              verified: true, // Since we filtered for verified specialists or package holders
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
