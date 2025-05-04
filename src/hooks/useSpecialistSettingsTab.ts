
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { useSpecialistSpecializationsManager } from "@/data/specializations";

export function useSpecialistSettingsTab(
  userId: string | undefined,
  specialistProfile: any,
  uploadProfilePhoto: (userId: string) => Promise<string | null>,
  photoUrl: string | null,
  services: string[],
  education: string[],
  processFormData: (formData: any, userId?: string, photoUrl?: string | null) => any
) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveSpecializations } = useSpecialistSpecializationsManager(userId);
  const lastPropsRef = useRef({ userId, specialistProfile, photoUrl, services, education });

  // Debug log current state ONLY when props change
  useEffect(() => {
    // Check if any props have changed before logging
    const currentProps = { userId, photoUrl, services, education, profileData: specialistProfile };
    const prevProps = lastPropsRef.current;
    
    const hasChanged = 
      prevProps.userId !== userId || 
      prevProps.photoUrl !== photoUrl || 
      prevProps.services !== services || 
      prevProps.education !== education || 
      prevProps.specialistProfile !== specialistProfile;
      
    if (hasChanged) {
      console.log("useSpecialistSettingsTab - Current state:", currentProps);
      lastPropsRef.current = { userId, specialistProfile, photoUrl, services, education };
    }
  }, [userId, photoUrl, services, education, specialistProfile]);

  // Memoize the submit function to prevent recreating it on every render
  const onProfileSubmit = useCallback(async (values: ProfileFormValues) => {
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
      console.log('Current services array:', services);
      console.log('Current education array:', education);
      
      // Display form validation errors for debugging
      const formErrors = Object.entries(values).filter(([key, value]) => {
        if (Array.isArray(value) && value.length === 0) return true;
        if (value === "" || value === undefined || value === null) return true;
        return false;
      });
      
      if (formErrors.length > 0) {
        console.log('Potential form validation issues:', formErrors);
      }
      
      // Upload profile photo if changed
      let photoUrlToSave = specialistProfile?.photo_url || null;
      if (photoUrl && photoUrl !== specialistProfile?.photo_url) {
        console.log('Uploading new profile photo');
        const uploadedUrl = await uploadProfilePhoto(userId);
        if (uploadedUrl) {
          photoUrlToSave = uploadedUrl;
          console.log('New photo URL:', photoUrlToSave);
        }
      }
      
      // Create the payload to update with proper data from services and education arrays
      const profileData = processFormData({
        ...values,
        services: services.filter(s => s.trim() !== ""),
        education: education.filter(e => e.trim() !== "")
      }, userId, photoUrlToSave);
      
      console.log('Saving profile data:', profileData);
      
      // CRITICAL FIX: Ensure the ID is properly set and never overwritten
      if (profileData.id !== userId) {
        console.error('ID mismatch detected. Setting correct user ID:', userId);
        profileData.id = userId;
      }
      
      // Update specialist profile in Supabase
      const { error, data } = await supabase
        .from('specialist_profiles')
        .upsert(profileData)
        .select();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log('Profile saved successfully, response:', data);
      
      // Save specializations
      if (values.specializations && values.specializations.length > 0) {
        console.log('Saving specializations:', values.specializations);
        const { success, error: specError } = await saveSpecializations(values.specializations);
        
        if (!success) {
          console.error("Error saving specializations:", specError);
          throw new Error(specError || "Error saving specializations");
        }
      } else {
        console.warn("No specializations to save - this might cause validation errors");
      }
      
      toast({
        title: "Profil zaktualizowany",
        description: "Twój profil specjalisty został pomyślnie zaktualizowany."
      });
      
    } catch (error: any) {
      console.error("Error updating specialist profile:", error);
      
      // Show more detailed toast with error information
      toast({
        title: "Błąd aktualizacji",
        description: error.message || "Nieznany błąd podczas aktualizacji profilu specjalisty",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [userId, specialistProfile, photoUrl, services, education, uploadProfilePhoto, processFormData, toast, saveSpecializations]);

  return {
    isSubmitting,
    onProfileSubmit
  };
}
