
import { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { AuthUser } from "@/services/authService";

export function useProfileFormInitialization(
  form: UseFormReturn<ProfileFormValues>,
  specialistProfile: any,
  isLoadingProfile: boolean,
  user: AuthUser | null,
  addService: () => void,
  updateService: (index: number, value: string) => void,
  services: string[],
  addEducation: () => void,
  updateEducation: (index: number, value: string) => void,
  education: string[],
  handlePhotoChange: (url: string | null, file: File | null) => void
) {
  // Initialize profile form when data is loaded
  useEffect(() => {
    if (!isLoadingProfile && specialistProfile && user) {
      console.log("Setting form values from profile data:", specialistProfile);
      
      // Initialize form with profile data
      form.reset({
        title: specialistProfile.title || "",
        description: specialistProfile.description || "",
        specializations: specialistProfile.specializationIds || [], // This is now correctly set from the specialized hook
        services: [],
        education: [],
        experience: specialistProfile.experience || "",
        location: specialistProfile.location || "",
        phoneNumber: specialistProfile.phone_number || "",
        website: specialistProfile.website || "",
        email: user?.email || "",
        socialMedia: specialistProfile.social_media || {
          facebook: "",
          instagram: "",
          twitter: "",
          linkedin: "",
          youtube: "",
          tiktok: "",
          twitch: ""
        }
      });
      
      // Handle photo
      if (specialistProfile.photo_url) {
        handlePhotoChange(specialistProfile.photo_url, null);
      }
      
      // Handle services array
      if (specialistProfile.services && Array.isArray(specialistProfile.services)) {
        // Clear existing services
        while (services.length > 0) {
          updateService(0, "");
        }
        
        // Add new services from profile
        if (specialistProfile.services.length > 0) {
          specialistProfile.services.forEach((service: string, index: number) => {
            if (index >= services.length) {
              addService();
            }
            updateService(index, service);
          });
        } else {
          // Add one empty service field if none exist
          if (services.length === 0) {
            addService();
          }
        }
      }
      
      // Handle education array
      if (specialistProfile.education && Array.isArray(specialistProfile.education)) {
        // Clear existing education
        while (education.length > 0) {
          updateEducation(0, "");
        }
        
        // Add new education from profile
        if (specialistProfile.education.length > 0) {
          specialistProfile.education.forEach((edu: string, index: number) => {
            if (index >= education.length) {
              addEducation();
            }
            updateEducation(index, edu);
          });
        } else {
          // Add one empty education field if none exist
          if (education.length === 0) {
            addEducation();
          }
        }
      }
    }
  }, [isLoadingProfile, specialistProfile, user, form]);

  return null;
}
