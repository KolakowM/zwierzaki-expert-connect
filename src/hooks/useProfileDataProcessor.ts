
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProfileDataProcessor() {
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Process form data - convert and sanitize for database
  const processFormData = async (formData: any, userId?: string, photoUrl?: string | null) => {
    try {
      console.log("Processing form data for user:", userId, "with photo:", photoUrl);
      
      // Clear any previous errors
      setProcessingError(null);
      
      // Process specialist data
      const processedData = {
        id: userId, // Make sure we include the user ID
        title: formData.title?.trim() || "Specjalista",
        description: formData.description?.trim() || "",
        experience: formData.experience?.trim() || "",
        location: formData.location?.trim() || "Polska",
        phone_number: formData.phoneNumber?.trim() || null,
        website: formData.website?.trim() || null,
        photo_url: photoUrl || null,
        // We'll handle specializations through the join table instead
        social_media: processedSocialMedia(formData),
      };

      console.log("Processed form data:", processedData);
      
      return processedData;
    } catch (error) {
      console.error("Error processing form data:", error);
      setProcessingError("Wystąpił błąd podczas przetwarzania danych formularza");
      throw error;
    }
  };

  // Process social media data
  const processedSocialMedia = (formData: any) => {
    const socialMedia: Record<string, string> = {};
    
    if (formData.facebook?.trim()) socialMedia.facebook = formData.facebook.trim();
    if (formData.instagram?.trim()) socialMedia.instagram = formData.instagram.trim();
    if (formData.linkedin?.trim()) socialMedia.linkedin = formData.linkedin.trim();
    if (formData.twitter?.trim()) socialMedia.twitter = formData.twitter.trim();
    
    return socialMedia;
  };

  // Correctly save specialization IDs to the join table
  const saveSpecializations = async (userId: string, specializationIds: string[]) => {
    try {
      console.log("Saving specializations for user:", userId, specializationIds);
      
      // First delete existing specializations
      const { error: deleteError } = await supabase
        .from('specialist_specializations')
        .delete()
        .eq('specialist_id', userId);
        
      if (deleteError) throw deleteError;
      
      // Only insert if we have valid specialization IDs
      if (specializationIds && specializationIds.length > 0) {
        // Prepare data for insert
        const specializations = specializationIds.map(specId => ({
          specialist_id: userId,
          specialization_id: specId,
        }));
        
        console.log("Inserting specializations:", specializations);
        
        // Insert new specializations
        const { error: insertError } = await supabase
          .from('specialist_specializations')
          .insert(specializations);
          
        if (insertError) {
          console.error("Error inserting specializations:", insertError);
          throw insertError;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error saving specializations:", error);
      setProcessingError("Wystąpił błąd podczas zapisywania specjalizacji");
      throw error;
    }
  };

  return {
    processFormData,
    processingError,
    saveSpecializations,
  };
}
