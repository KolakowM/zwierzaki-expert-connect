
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { ProfileFormValues, profileFormSchema } from "@/components/profile/SpecialistProfileTab";
import { useToast } from "@/hooks/use-toast";
import { useProfileForm } from "@/hooks/useProfileForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormSkeleton } from "./ProfileFormSkeleton";
import { ProfileFormWrapper } from "./ProfileFormWrapper";
import { ProfileNavigationButtons } from "./ProfileNavigationButtons";
import { ProfileNotifications } from "./ProfileNotifications";

const ProfileEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
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
        
        // Get user email from auth context instead of fetching from user_profiles
        const userEmail = user?.email || '';
          
        console.log('Profile data:', profileData);
        
        if (profileData) {
          // Set initial form values from database
          const socialMedia = profileData.social_media || {};
          
          form.reset({
            title: profileData.title || "",
            description: profileData.description || "",
            specializations: profileData.specializations || [],
            experience: profileData.experience || "",
            location: profileData.location || "",
            phoneNumber: profileData.phone_number || "",
            email: userEmail,
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
  }, [userId, user?.email, form, services, education, toast]);

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
      // Reset notification states
      setSaveError(null);
      setSaveSuccess(false);
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
      
      // Show success notification
      setSaveSuccess(true);
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
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError(error instanceof Error ? error.message : "Nieznany błąd podczas zapisywania profilu");
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

          <ProfileNotifications 
            saveSuccess={saveSuccess} 
            saveError={saveError} 
          />

          {loading ? (
            <ProfileFormSkeleton />
          ) : (
            <ProfileFormWrapper
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

          <ProfileNavigationButtons 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSubmitting={isSubmitting}
            onSubmit={() => form.handleSubmit(onSubmit)()}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfileEditor;
