
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
        
        // Step 1: Get the Zawodowiec package ID first
        const { data: zawodowiecPackage, error: packageError } = await supabase
          .from('packages')
          .select('id')
          .eq('name', 'Zawodowiec')
          .eq('can_access_carousel', true)
          .eq('is_active', true)
          .single();

        if (packageError) {
          console.error("Error fetching Zawodowiec package:", packageError);
          throw packageError;
        }

        if (!zawodowiecPackage) {
          console.log("No Zawodowiec package found");
          setSpecialists([]);
          return;
        }

        console.log("Found Zawodowiec package:", zawodowiecPackage.id);

        // Step 2: Get users with active Zawodowiec subscriptions using specific relationship
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('user_subscriptions')
          .select(`
            user_id,
            packages!fk_user_subscriptions_package_id(
              id,
              name,
              can_access_carousel
            )
          `)
          .eq('status', 'active')
          .eq('package_id', zawodowiecPackage.id)
          .gte('end_date', new Date().toISOString())
          .limit(limit);

        if (subscriptionsError) {
          console.error("Error fetching subscriptions:", subscriptionsError);
          throw subscriptionsError;
        }

        if (!subscriptionsData || subscriptionsData.length === 0) {
          console.log("No active Zawodowiec package subscriptions found");
          setSpecialists([]);
          return;
        }

        console.log(`Found ${subscriptionsData.length} active Zawodowiec subscriptions`);

        // Extract user IDs from subscriptions
        const userIds = subscriptionsData.map(sub => sub.user_id);

        // Step 3: Get user profiles for these users
        const { data: userProfilesData, error: userProfilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', userIds);

        if (userProfilesError) {
          console.error("Error fetching user profiles:", userProfilesError);
          throw userProfilesError;
        }

        // Step 4: Get specialist profiles for these users
        const { data: specialistProfilesData, error: specialistProfilesError } = await supabase
          .from('specialist_profiles')
          .select('*')
          .in('id', userIds);

        if (specialistProfilesError) {
          console.error("Error fetching specialist profiles:", specialistProfilesError);
        }

        // Step 5: Get user roles for these users
        const { data: userRolesData, error: userRolesError } = await supabase
          .from('user_roles')
          .select('*')
          .in('user_id', userIds)
          .eq('role', 'specialist');

        if (userRolesError) {
          console.error("Error fetching user roles:", userRolesError);
        }

        // Step 6: Get specializations for all found specialists
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

        const userRolesMap = userRolesData?.reduce((acc, role) => {
          acc[role.user_id] = role;
          return acc;
        }, {} as Record<string, any>) || {};
        
        // Transform the data into the format expected by SpecialistCard
        const transformedData: Specialist[] = subscriptionsData
          .map(subscription => {
            const userId = subscription.user_id;
            const userProfile = userProfilesMap[userId];
            const specialistProfile = specialistProfilesMap[userId];
            const userRole = userRolesMap[userId];
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
              verified: userRole?.status === 'zweryfikowany', // Check verification status
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
