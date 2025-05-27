
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
        
        // Get specialists with "Zawodowiec" package
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('user_subscriptions')
          .select(`
            user_id,
            packages!inner(
              id,
              name
            )
          `)
          .eq('status', 'active')
          .eq('packages.name', 'Zawodowiec')
          .limit(limit);

        if (subscriptionsError) throw subscriptionsError;

        if (subscriptionsData && subscriptionsData.length > 0) {
          const specialistIds = subscriptionsData.map(sub => sub.user_id);
          
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
            .in('id', specialistIds);
            
          if (profilesError) throw profilesError;
          
          // Get user profiles data separately
          const { data: userProfilesData, error: userProfilesError } = await supabase
            .from('user_profiles')
            .select('id, first_name, last_name')
            .in('id', specialistIds);
            
          if (userProfilesError) throw userProfilesError;
          
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
                name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`,
                title: profile.title || "Specjalista",
                specializations: profile.specializations || [],
                location: profile.location || "Polska",
                image: profile.photo_url || "https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop",
                rating: 5.0, // Default rating
                verified: true, // Since we filtered for verified specialists
                role: 'specialist'
              };
            });
            
            setSpecialists(transformedData);
          }
        } else {
          // Fallback to verified specialists if no "Zawodowiec" package users found
          const { data: userRolesData, error: userRolesError } = await supabase
            .from('user_roles')
            .select('user_id, role, status')
            .eq('role', 'specialist')
            .eq('status', 'zweryfikowany')
            .limit(limit);

          if (userRolesError) throw userRolesError;

          if (userRolesData && userRolesData.length > 0) {
            const specialistIds = userRolesData.map(item => item.user_id);
            
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
              .in('id', specialistIds);
              
            if (profilesError) throw profilesError;
            
            const { data: userProfilesData, error: userProfilesError } = await supabase
              .from('user_profiles')
              .select('id, first_name, last_name')
              .in('id', specialistIds);
              
            if (userProfilesError) throw userProfilesError;
            
            const userProfilesMap = userProfilesData?.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as Record<string, any>) || {};
            
            if (profilesData) {
              const transformedData: Specialist[] = profilesData.map(profile => {
                const userProfile = userProfilesMap[profile.id] || {};
                
                return {
                  id: profile.id,
                  name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`,
                  title: profile.title || "Specjalista",
                  specializations: profile.specializations || [],
                  location: profile.location || "Polska",
                  image: profile.photo_url || "https://images.unsplash.com/photo-1570018144715-43110363d70a?q=80&w=2576&auto=format&fit=crop",
                  rating: 5.0,
                  verified: true,
                  role: 'specialist'
                };
              });
              
              setSpecialists(transformedData);
            }
          } else {
            setSpecialists([]);
          }
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
