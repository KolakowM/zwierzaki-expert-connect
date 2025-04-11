
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";

export function useProfileFormInitialization(
  profileForm: UseFormReturn<ProfileFormValues>,
  specialistProfile: any,
  isLoadingProfile: boolean,
  user: any,
  addService: () => void,
  updateService: (index: number, value: string) => void,
  services: string[],
  addEducation: () => void,
  updateEducation: (index: number, value: string) => void,
  education: string[],
  handlePhotoChange: (url: string | null, file: File | null) => void
) {
  // Update profileForm when specialistProfile is loaded
  useEffect(() => {
    if (specialistProfile && !isLoadingProfile) {
      // Initialize a default empty social media object
      const socialMedia = {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
        twitch: ""
      };
      
      // Safely extract social media data
      if (specialistProfile.social_media && typeof specialistProfile.social_media === 'object') {
        const sm = specialistProfile.social_media;
        if (typeof sm.facebook === 'string') socialMedia.facebook = sm.facebook;
        if (typeof sm.instagram === 'string') socialMedia.instagram = sm.instagram;
        if (typeof sm.twitter === 'string') socialMedia.twitter = sm.twitter;
        if (typeof sm.linkedin === 'string') socialMedia.linkedin = sm.linkedin;
        if (typeof sm.youtube === 'string') socialMedia.youtube = sm.youtube;
        if (typeof sm.tiktok === 'string') socialMedia.tiktok = sm.tiktok;
        if (typeof sm.twitch === 'string') socialMedia.twitch = sm.twitch;
      }
      
      // Update services and education arrays
      if (Array.isArray(specialistProfile.services)) {
        const svcs = [...specialistProfile.services];
        while (services.length < svcs.length) addService();
        svcs.forEach((svc: string, idx: number) => updateService(idx, svc));
      }
      
      if (Array.isArray(specialistProfile.education)) {
        const edu = [...specialistProfile.education];
        while (education.length < edu.length) addEducation();
        edu.forEach((item: string, idx: number) => updateEducation(idx, item));
      }
      
      // Reset form with specialist profile data
      profileForm.reset({
        title: specialistProfile.title || "",
        description: specialistProfile.description || "",
        specializations: specialistProfile.specializations || [],
        services: specialistProfile.services || [],
        education: specialistProfile.education || [],
        experience: specialistProfile.experience || "",
        location: specialistProfile.location || "",
        phoneNumber: specialistProfile.phone_number || "",
        email: user?.email || "",
        website: specialistProfile.website || "",
        socialMedia
      });
      
      // Set photo URL if available
      if (specialistProfile.photo_url) {
        handlePhotoChange(specialistProfile.photo_url, null);
      }
    }
  }, [specialistProfile, isLoadingProfile, user?.email, profileForm, addService, updateService, education, services, addEducation, updateEducation, handlePhotoChange]);
}
