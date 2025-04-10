
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SpecialistProfileTab, ProfileFormValues, profileFormSchema } from "@/components/profile/SpecialistProfileTab";
import { useToast } from "@/hooks/use-toast";
import { useProfileForm } from "@/hooks/useProfileForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { SocialMediaLinks } from "@/types";

const ProfileEditor = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  
  const {
    services,
    education,
    photoUrl,
    isSubmitting,
    isUploading,
    setIsSubmitting,
    uploadProfilePhoto,
    addService,
    updateService,
    removeService,
    addEducation,
    updateEducation,
    removeEducation,
    handlePhotoChange,
    processFormData,
  } = useProfileForm();

  // Create form with zod validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      title: "",
      description: "",
      specializations: [],
      experience: "",
      location: "",
      phoneNumber: "",
      email: "",
      website: "",
      socialMedia: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
        twitch: ""
      }
    }
  });

  // Load existing profile data if available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        console.log('Fetching specialist profile for user:', userId);
        
        // Get specialist profile
        const { data: profileData, error: profileError } = await supabase
          .from('specialist_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (profileError) throw profileError;
        
        // Get user data (for email)
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (userError) throw userError;
        
        console.log('Profile data:', profileData);
        console.log('User data:', userData);
        
        if (profileData) {
          // Set initial form values from database
          const socialMedia = profileData.social_media as SocialMediaLinks || {};
          
          form.reset({
            title: profileData.title || "",
            description: profileData.description || "",
            specializations: profileData.specializations || [],
            experience: profileData.experience || "",
            location: profileData.location || "",
            phoneNumber: profileData.phone_number || "",
            email: userData?.email || session?.user?.email || "",
            website: profileData.website || "",
            socialMedia: {
              facebook: socialMedia.facebook || "",
              instagram: socialMedia.instagram || "",
              twitter: socialMedia.twitter || "",
              linkedin: socialMedia.linkedin || "",
              youtube: socialMedia.youtube || "",
              tiktok: socialMedia.tiktok || "",
              twitch: socialMedia.twitch || ""
            }
          });
          
          // Initialize services and education arrays
          if (profileData.services && profileData.services.length > 0) {
            services.splice(0, services.length, ...profileData.services);
          }
          
          if (profileData.education && profileData.education.length > 0) {
            education.splice(0, education.length, ...profileData.education);
          }
          
          setInitialData(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się załadować profilu",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  // Submit form handler
  const onSubmit = async (values: ProfileFormValues) => {
    if (!userId) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany, aby edytować profil",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Saving profile with values:', values);
      
      // Upload photo if provided
      let photoUrlToSave = initialData?.photo_url;
      
      if (photoUrl && photoUrl !== initialData?.photo_url) {
        photoUrlToSave = await uploadProfilePhoto(userId);
      }
      
      // Prepare data for saving
      const profileData = processFormData(values, userId, photoUrlToSave);
      
      console.log('Saving profile data:', profileData);
      
      // Save to Supabase
      const { error } = await supabase
        .from('specialist_profiles')
        .upsert(profileData)
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Zapisano",
        description: "Twój profil został pomyślnie zapisany",
      });
      
      // Move to the next tab after saving basic info
      if (activeTab === "basic") {
        setActiveTab("specializations");
      } else if (activeTab === "specializations") {
        setActiveTab("contact");
      } else if (activeTab === "contact") {
        setActiveTab("social");
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać profilu",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Edytuj profil specjalisty</h1>
            <p className="text-muted-foreground">
              Uzupełnij informacje o sobie, aby potencjalni klienci mogli Cię lepiej poznać
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <SpecialistProfileTab
              form={form}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSubmit={onSubmit}
              photoUrl={photoUrl || initialData?.photo_url}
              userId={userId}
              services={services}
              education={education}
              isSubmitting={isSubmitting}
              updateService={updateService}
              removeService={removeService}
              addService={addService}
              updateEducation={updateEducation}
              removeEducation={removeEducation}
              addEducation={addEducation}
              onPhotoChange={handlePhotoChange}
            />
          )}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (activeTab === "specializations") {
                  setActiveTab("basic");
                } else if (activeTab === "contact") {
                  setActiveTab("specializations");
                } else if (activeTab === "social") {
                  setActiveTab("contact");
                }
              }}
              disabled={activeTab === "basic" || isSubmitting}
            >
              Wstecz
            </Button>

            <Button
              type="button"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Zapisywanie..." : "Zapisz i kontynuuj"}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfileEditor;
