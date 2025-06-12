
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
        console.log("Fetching verified specialists with role 'specialist' and status 'zweryfikowany', limit:", limit);
        
        // Step 1: Get verified specialists from user_roles
        const { data: verifiedSpecialists, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'specialist')
          .eq('status', 'zweryfikowany')
          .limit(limit);

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
        const userIds = verifiedSpecialists.map(role => role.user_id);

        // Step 2: Get featured user IDs (active featured subscriptions)
        const { data: featuredSubscriptions, error: featuredError } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('package_id', '3d73a98e-9d72-47f6-b7c4-88167300b66c')
          .eq('status', 'active')
          .in('user_id', userIds);

        if (featuredError) {
          console.error("Error fetching featured subscriptions:", featuredError);
        }

        const featuredUserIds = new Set(featuredSubscriptions?.map(sub => sub.user_id) || []);
        console.log("Featured user IDs:", Array.from(featuredUserIds));

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

        // Step 5: Get specializations for all found specialists
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
        
        // Transform the data into the format expected by SpecialistCard
        const transformedData: Specialist[] = verifiedSpecialists
          .map(roleData => {
            const userId = roleData.user_id;
            const userProfile = userProfilesMap[userId];
            const specialistProfile = specialistProfilesMap[userId];
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
              verified: true, // All these specialists are verified
              role: 'specialist',
              is_featured: featuredUserIds.has(userId) // Check if user has featured subscription
            };
          })
          .filter(Boolean) as Specialist[];
          
        console.log("Transformed verified specialists data:", transformedData.length);
        console.log("Featured specialists:", transformedData.filter(s => s.is_featured).length);
        console.log("Sample specialist with featured status:", transformedData[0]);
        setSpecialists(transformedData);
        
      } catch (err) {
        console.error("Error fetching verified specialists:", err);
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
