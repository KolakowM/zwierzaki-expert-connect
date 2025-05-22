
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProfileDataProcessor() {
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Process form data - convert and sanitize for database
  const processFormData = (formData: any, userId?: string, photoUrl?: string | null) => {
    try {
      console.log("Processing form data for user:", userId, "with photo:", photoUrl);
      
      // Clear any previous errors
      setProcessingError(null);
      
      if (!userId) {
        console.error("Missing user ID when processing form data");
        throw new Error("Brak identyfikatora użytkownika - zaloguj się ponownie");
      }
      
      // Process specialist data - IMPORTANT: Make sure id is set to userId
      const processedData = {
        id: userId, // ID musi być zgodne z ID zalogowanego użytkownika
        title: formData.title?.trim() || "Specjalista",
        description: formData.description?.trim() || "",
        experience: formData.experience?.trim() || "",
        location: formData.location?.trim() || "Polska",
        phone_number: formData.phoneNumber?.trim() || null,
        email: formData.email?.trim() || null, // Added email field
        website: formData.website?.trim() || null,
        photo_url: photoUrl || null,
        // We'll handle specializations through the join table instead
        social_media: processedSocialMedia(formData),
        services: Array.isArray(formData.services) ? formData.services.filter((s: string) => s.trim() !== "") : [],
        education: Array.isArray(formData.education) ? formData.education.filter((e: string) => e.trim() !== "") : []
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
    
    if (formData.socialMedia) {
      if (formData.socialMedia.facebook?.trim()) socialMedia.facebook = formData.socialMedia.facebook.trim();
      if (formData.socialMedia.instagram?.trim()) socialMedia.instagram = formData.socialMedia.instagram.trim();
      if (formData.socialMedia.linkedin?.trim()) socialMedia.linkedin = formData.socialMedia.linkedin.trim();
      if (formData.socialMedia.twitter?.trim()) socialMedia.twitter = formData.socialMedia.twitter.trim();
    } else {
      // Handle legacy structure
      if (formData.facebook?.trim()) socialMedia.facebook = formData.facebook.trim();
      if (formData.instagram?.trim()) socialMedia.instagram = formData.instagram.trim();
      if (formData.linkedin?.trim()) socialMedia.linkedin = formData.linkedin.trim();
      if (formData.twitter?.trim()) socialMedia.twitter = formData.twitter.trim();
    }
    
    return socialMedia;
  };

  return {
    processFormData,
    processingError,
  };
}
