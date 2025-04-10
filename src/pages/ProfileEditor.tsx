import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useProfileForm } from "@/hooks/useProfileForm";
import { SpecialistProfileTab, profileFormSchema, ProfileFormValues } from "@/components/profile/SpecialistProfileTab";

export default function ProfileEditor() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [existingProfile, setExistingProfile] = useState<any>(null);
  
  const {
    services,
    education,
    photoUrl,
    photoFile,
    isSubmitting,
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
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      title: "",
      description: "",
      specializations: [],
      services: [],
      education: [],
      experience: "",
      location: "",
      phoneNumber: "",
      email: user?.email || "",
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
    },
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('specialist_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          console.log('Loaded profile data:', data);
          setExistingProfile(data);
          
          form.reset({
            title: data.title || "",
            description: data.description || "",
            specializations: data.specializations || [],
            services: data.services || [],
            education: data.education || [],
            experience: data.experience || "",
            location: data.location || "",
            phoneNumber: data.phone_number || "",
            email: user.email || "",
            website: data.website || "",
            socialMedia: data.social_media || {
              facebook: "",
              instagram: "",
              twitter: "",
              linkedin: "",
              youtube: "",
              tiktok: "",
              twitch: ""
            }
          });
          
          if (data.services?.length) {
            const servicesWithEmpty = [...data.services, ""];
            setServices(servicesWithEmpty);
          }
          
          if (data.education?.length) {
            const educationWithEmpty = [...data.education, ""];
            setEducation(educationWithEmpty);
          }
          
          if (data.photo_url) {
            handlePhotoChange(data.photo_url, null);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    fetchProfileData();
  }, [user?.id]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsSubmitting(true);
      
      if (!user?.id) {
        throw new Error("Użytkownik nie jest zalogowany");
      }
      
      console.log('Submitting profile with values:', values);
      
      let photoUrlToSave = existingProfile?.photo_url || null;
      if (photoFile) {
        console.log('Uploading new photo');
        photoUrlToSave = await uploadProfilePhoto(user.id);
        console.log('Photo uploaded, URL:', photoUrlToSave);
      } else if (photoUrl && !photoUrl.startsWith('data:')) {
        photoUrlToSave = photoUrl;
      }
      
      const profileData = processFormData(values, user.id, photoUrlToSave);
      console.log('Processed profile data:', profileData);
      
      const { error } = await supabase
        .from('specialist_profiles')
        .upsert(profileData);
      
      if (error) throw error;
      
      toast({
        title: "Profil zaktualizowany",
        description: "Twój profil został pomyślnie zaktualizowany.",
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Błąd zapisu",
        description: error.message || "Wystąpił błąd podczas zapisywania profilu.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Edycja profilu specjalisty</h1>
          </div>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-600">Uzupełnij swój profil</CardTitle>
              <CardDescription>
                Aby być widocznym w katalogu specjalistów, uzupełnij wszystkie wymagane pola profilu.
                Im więcej informacji podasz, tym większa szansa, że klienci Cię znajdą.
              </CardDescription>
            </CardHeader>
          </Card>

          <SpecialistProfileTab
            form={form}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSubmit={onSubmit}
            photoUrl={photoUrl}
            userId={user?.id}
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
        </div>
      </div>
    </MainLayout>
  );
}
