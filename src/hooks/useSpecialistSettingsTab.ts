
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";

export function useSpecialistSettingsTab(
  userId: string | undefined,
  specialistProfile: any,
  uploadProfilePhoto: (userId: string) => Promise<string | null>,
  photoUrl: string | null,
  services: string[],
  education: string[],
  processFormData: (formData: any, userId: string | undefined, photoUrl?: string | null) => any
) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onProfileSubmit(values: ProfileFormValues) {
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
      
      // Upload profile photo if changed
      let photoUrlToSave = specialistProfile?.photo_url || null;
      if (photoUrl && photoUrl !== specialistProfile?.photo_url) {
        const uploadedUrl = await uploadProfilePhoto(userId);
        if (uploadedUrl) {
          photoUrlToSave = uploadedUrl;
        }
      }
      
      // Create the payload to update
      const profileData = processFormData(values, userId, photoUrlToSave);
      
      console.log('Saving profile data:', profileData);
      
      // Update specialist profile in Supabase
      const { error } = await supabase
        .from('specialist_profiles')
        .upsert(profileData);
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      toast({
        title: "Profil zaktualizowany",
        description: "Twój profil specjalisty został pomyślnie zaktualizowany."
      });
      
    } catch (error: any) {
      console.error("Error updating specialist profile:", error);
      toast({
        title: "Błąd aktualizacji",
        description: error.message || "Wystąpił błąd podczas aktualizacji profilu specjalisty.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    onProfileSubmit
  };
}
