
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { UseFormReturn } from "react-hook-form";
import { useSpecialistSpecializationsManager } from "@/data/specializations";

interface UseProfileFormSubmitProps {
  form: UseFormReturn<ProfileFormValues>;
  userId: string | undefined;
  initialData: any;
  photoUrl: string | null;
  services: string[];
  education: string[];
  setActiveTab: (tab: string) => void;
  activeTab: string;
  setSaveSuccess: (value: boolean) => void;
  setSaveError: (value: string | null) => void;
  uploadProfilePhoto: (userId: string) => Promise<string | null>;
  processFormData: (formData: any, userId?: string, photoUrl?: string | null) => any;
}

export const useProfileFormSubmit = ({
  form,
  userId,
  initialData,
  photoUrl,
  services,
  education,
  setActiveTab,
  activeTab,
  setSaveSuccess,
  setSaveError,
  uploadProfilePhoto,
  processFormData
}: UseProfileFormSubmitProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveSpecializations } = useSpecialistSpecializationsManager(userId);

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
      
      // Save specializations regardless of which tab we're on
      if (values.specializations && values.specializations.length > 0) {
        console.log('Saving specializations:', values.specializations);
        const { success, error: specError } = await saveSpecializations(values.specializations);
        
        if (!success) {
          console.error('Error saving specializations:', specError);
          throw new Error(specError || 'Error saving specializations');
        }
      }
      
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
      
      // Show error message without JSX
      const errorFields = Object.keys(form.formState.errors);
      const errorMsg = error instanceof Error ? error.message : "Nieznany błąd";
      
      toast({
        title: "Błąd",
        description: `Nie udało się zapisać profilu. ${errorMsg}. ${errorFields.length > 0 ? 'Pola z błędami: ' + errorFields.join(', ') : ''}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    onSubmit
  };
};
