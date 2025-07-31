
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
        console.log("Fetching specialists with priority for featured users, limit:", limit);
        
        // Step 1: Get featured user IDs (active featured subscriptions)
        const { data: featuredSubscriptions, error: featuredError } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('package_id', '3d73a98e-9d72-47f6-b7c4-88167300b66c')
          .eq('status', 'active');

        if (featuredError) {
          console.error("Error fetching featured subscriptions:", featuredError);
        }

        const featuredUserIds = new Set(featuredSubscriptions?.map(sub => sub.user_id) || []);
        console.log("Featured user IDs:", Array.from(featuredUserIds));

        // Step 2: Get verified specialists from user_roles
        const { data: verifiedSpecialists, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'specialist')
          .eq('status', 'zweryfikowany');

        if (rolesError) {
          console.error("Error fetching verified specialists:", rolesError);
          throw rolesError;
        }

        if (!verifiedSpecialists || verifiedSpecialists.length === 0) {
          console.log("No verified specialists found");
          setSpecialists([]);
          return;
        }

        console.log(`Found ${verifiedSpecialists.length} verified specialists`);

        // Extract user IDs
        const verifiedUserIds = verifiedSpecialists.map(role => role.user_id);

        // Step 3: Create combined user list with featured users prioritized
        const featuredVerifiedIds = verifiedUserIds.filter(id => featuredUserIds.has(id));
        const nonFeaturedVerifiedIds = verifiedUserIds.filter(id => !featuredUserIds.has(id));
        
        // Prioritize featured specialists, then add non-featured ones
        const prioritizedUserIds = [...featuredVerifiedIds, ...nonFeaturedVerifiedIds].slice(0, limit);
        
        console.log(`Featured verified specialists: ${featuredVerifiedIds.length}`);
        console.log(`Non-featured verified specialists: ${nonFeaturedVerifiedIds.length}`);
        console.log(`Total prioritized specialists to fetch: ${prioritizedUserIds.length}`);

        // Step 4: Get user profiles for these users
        const { data: userProfilesData, error: userProfilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', prioritizedUserIds);

        if (userProfilesError) {
          console.error("Error fetching user profiles:", userProfilesError);
          throw userProfilesError;
        }

        // Step 5: Get specialist profiles for these users
        const { data: specialistProfilesData, error: specialistProfilesError } = await supabase
          .from('specialist_profiles')
          .select('*')
          .in('id', prioritizedUserIds);

        if (specialistProfilesError) {
          console.error("Error fetching specialist profiles:", specialistProfilesError);
        }

        // Step 6: Get specializations for all found specialists
        const { data: specializationsData, error: specializationsError } = await supabase
          .from('specialist_specializations')
          .select(`
            specialist_id,
            specialization_id,
            specializations!inner(id, name)
          `)
          .in('specialist_id', prioritizedUserIds)
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
        const transformedData: Specialist[] = prioritizedUserIds
          .map(userId => {
            const userProfile = userProfilesMap[userId];
            const specialistProfile = specialistProfilesMap[userId];
            const userSpecializations = specializationsMap[userId] || [];
            
            if (!userProfile) {
              console.warn(`No user profile found for specialist ${userId}`);
              return null;
            }
            
            const isFeatured = featuredUserIds.has(userId);
            console.log(`Specialist ${userProfile.first_name} ${userProfile.last_name} - Featured: ${isFeatured}`);
            
            return {
              id: userId,
              name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Specjalista',
              title: specialistProfile?.title || "Specjalista",
              specializations: userSpecializations,
              location: specialistProfile?.location || userProfile.city || "Polska",
              image: specialistProfile?.photo_url || "https://wrftbhmnqrdogomhvomr.supabase.co/storage/v1/object/public/profiles/profile-photos/ChatGPT%20Image%2031%20lip%202025,%2018_51_51.png",
              email: specialistProfile?.email || userProfile.email,
              rating: 5.0, // Default rating
              verified: true, // All these specialists are verified
              role: 'specialist',
              is_featured: isFeatured
            };
          })
          .filter(Boolean) as Specialist[];
          
        // Sort to ensure featured specialists appear first
        const sortedData = transformedData.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
          
        console.log("Final transformed specialists data:", sortedData.length);
        console.log("Featured specialists in final list:", sortedData.filter(s => s.is_featured).length);
        console.log("First 3 specialists:", sortedData.slice(0, 3).map(s => ({ name: s.name, featured: s.is_featured })));
        
        setSpecialists(sortedData);
        
      } catch (err) {
        console.error("Error fetching specialists:", err);
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
