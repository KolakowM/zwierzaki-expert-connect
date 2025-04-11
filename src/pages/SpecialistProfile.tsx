
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/specialists/profile/ProfileHeader";
import { ContactInfo } from "@/components/specialists/profile/ContactInfo";
import { SpecializationsList } from "@/components/specialists/profile/SpecializationsList";
import { ProfileTabs } from "@/components/specialists/profile/ProfileTabs";
import { useProfileSocialIcons } from "@/components/specialists/profile/ProfileSocialIcons";
import { SocialMediaLinks } from "@/types";

const SpecialistProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [specialist, setSpecialist] = useState<any>(null);
  const socialMediaIcons = useProfileSocialIcons();

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        setLoading(true);
        console.log('Fetching specialist profile with ID:', id);
        
        // First try to get the specialist profile
        const { data, error } = await supabase
          .from('specialist_profiles')
          .select('*')
          .eq('id', id || '')
          .maybeSingle();
        
        if (error) throw error;
        
        // Now try to get the user profile to get name
        let userName = "Specjalista";
        
        try {
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('first_name, last_name')
            .eq('id', id || '')
            .maybeSingle();
            
          if (userData) {
            userName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            if (!userName) userName = "Specjalista";
          }
        } catch (userError) {
          console.error('Error fetching user profile:', userError);
        }
        
        if (data) {
          console.log('Loaded specialist profile:', data);
          setSpecialist({
            id: data.id,
            name: userName || "Specjalista",
            title: data.title || "Specjalista",
            description: data.description || "Brak opisu",
            services: data.services || [],
            education: data.education || [],
            experience: data.experience || "Brak informacji o doświadczeniu",
            location: data.location || "Brak lokalizacji",
            phoneNumber: data.phone_number || "Brak numeru telefonu",
            email: "Brak adresu email", // We don't have direct access to email
            website: data.website || "",
            socialMedia: data.social_media || {},
            image: data.photo_url || null,
            rating: 4.9, // Sample rating for UI display
            reviewCount: 5, // Sample review count for UI display
            verified: true, // Sample verified status for UI display
          });
        } else {
          // Fallback to sample data for demo
          setSpecialist({
            id: "1",
            name: "Specjalista",
            title: "Specjalista",
            description: "Brak opisu",
            services: ["Konsultacje"],
            education: ["Edukacja"],
            experience: "Brak informacji o doświadczeniu",
            location: "Brak lokalizacji",
            phoneNumber: "Brak numeru telefonu",
            email: "Brak adresu email",
            website: "",
            socialMedia: {} as SocialMediaLinks,
            image: null,
            rating: 4.9,
            reviewCount: 5,
            verified: true,
          });
        }
      } catch (error) {
        console.error("Error fetching specialist profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecialist();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!specialist) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Specjalista nie został znaleziony</h1>
            <p className="text-muted-foreground">
              Nie mogliśmy znaleźć specjalisty o podanym identyfikatorze.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column - Profile info */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <ProfileHeader specialist={specialist} />
                <div className="p-6">
                  <ContactInfo 
                    specialist={specialist} 
                    socialMediaIcons={socialMediaIcons} 
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Specializations */}
            <SpecializationsList specialistId={specialist.id} />
          </div>
          
          {/* Right column - Tabs with detailed info */}
          <div className="md:col-span-2">
            <ProfileTabs specialist={specialist} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SpecialistProfile;
