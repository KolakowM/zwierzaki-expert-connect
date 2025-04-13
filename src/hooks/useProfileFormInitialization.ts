
import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { useSpecialistSpecializations } from "@/hooks/useSpecializations";

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
  // Track if the form has been initialized already
  const initialized = useRef(false);
  // Get the user's specializations
  const { specializationIds } = useSpecialistSpecializations(user?.id);

  // Update profileForm when specialistProfile is loaded - ONLY ONCE
  useEffect(() => {
    // Skip if already initialized or if profile is still loading or not available
    if (initialized.current || isLoadingProfile || !specialistProfile) {
      return;
    }
    
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
      
      // Clear existing services and add new ones from profile
      const svcs = [...specialistProfile.services];
      
      // Reset services state
      if (svcs.length === 0) {
        // Just keep the empty service field if none exist
        if (services.length === 0) {
          addService();
        }
      } else {
        // Set all services from profile
        svcs.forEach((svc: string, index: number) => {
          if (index < services.length) {
            updateService(index, svc);
          } else {
            updateService(services.length, svc);
            addService();
          }
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
      
      // Add education from profile
      const edu = [...specialistProfile.education];
      
      // Reset education state
      if (edu.length === 0) {
        // Just keep the empty education field if none exist
        if (education.length === 0) {
          addEducation();
        }
      } else {
        // Set all education entries from profile
        edu.forEach((item: string, index: number) => {
          if (index < education.length) {
            updateEducation(index, item);
          } else {
            updateEducation(education.length, item);
            addEducation();
          }
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
      specializations: specializationIds || [], // Use the specialization IDs from the junction table
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
    
    // Mark as initialized to prevent re-running
    initialized.current = true;
  }, [specialistProfile, isLoadingProfile, specializationIds]);

  // Update specializations when they are loaded
  useEffect(() => {
    if (initialized.current && specializationIds && specializationIds.length > 0) {
      console.log("Setting specializations in form:", specializationIds);
      profileForm.setValue('specializations', specializationIds);
    }
  }, [specializationIds, profileForm, initialized.current]);
}
