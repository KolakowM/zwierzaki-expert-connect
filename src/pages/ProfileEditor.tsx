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
  
  const {
    services,
    education,
    photoUrl,
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

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsSubmitting(true);
      
      // Upload profile photo if provided
      let photoUrlToSave = null;
      if (photoUrl && photoFile) {
        photoUrlToSave = await uploadProfilePhoto(user?.id || "");
      }
      
      if (!user?.id) {
        throw new Error("Użytkownik nie jest zalogowany");
      }
      
      // Create profile data object
      const profileData = processFormData(values, user.id);
      
      // Explicitly add the photo_url to the profileData if it was uploaded
      if (photoUrlToSave) {
        profileData.photo_url = photoUrlToSave;
      }
      
      // Save the profile data to Supabase
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
