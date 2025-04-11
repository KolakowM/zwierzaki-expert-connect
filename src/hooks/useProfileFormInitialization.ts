
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
      console.log("Initializing profile form with data:", specialistProfile);
      
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
      
      // Update services array
      if (Array.isArray(specialistProfile.services)) {
        console.log("Setting up services array:", specialistProfile.services);
        // Clear existing services
        while (services.length > 0) services.pop();
        
        // Add services from profile
        const svcs = [...specialistProfile.services];
        if (svcs.length === 0) {
          // Add empty service if none exist
          addService();
        } else {
          // Add all services from profile
          svcs.forEach((svc: string) => {
            updateService(services.length, svc);
            addService();
          });
        }
      } else {
        // Ensure at least one empty service field
        if (services.length === 0) {
          addService();
        }
      }
      
      // Update education array
      if (Array.isArray(specialistProfile.education)) {
        console.log("Setting up education array:", specialistProfile.education);
        // Clear existing education
        while (education.length > 0) education.pop();
        
        // Add education from profile
        const edu = [...specialistProfile.education];
        if (edu.length === 0) {
          // Add empty education if none exist
          addEducation();
        } else {
          // Add all education from profile
          edu.forEach((item: string) => {
            updateEducation(education.length, item);
            addEducation();
          });
        }
      } else {
        // Ensure at least one empty education field
        if (education.length === 0) {
          addEducation();
        }
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
