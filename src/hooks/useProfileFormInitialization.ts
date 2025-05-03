
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
  // Śledzimy, czy formularz został już zainicjalizowany
  const initialized = useRef(false);
  // Pobierz specjalizacje użytkownika
  const { specializationIds } = useSpecialistSpecializations(user?.id);

  // Aktualizuj formularz, gdy dane profilu zostaną załadowane - TYLKO RAZ
  useEffect(() => {
    // Pomijamy inicjalizację jeśli już wykonana lub jeśli profil jest wciąż ładowany lub niedostępny
    if (initialized.current || isLoadingProfile || !specialistProfile) {
      return;
    }
    
    console.log("Inicjalizacja formularza profilu danymi:", specialistProfile);
    
    // Przygotuj obiekt socialMedia z domyślnymi pustymi wartościami
    const socialMedia = {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
      twitch: ""
    };
    
    // Bezpiecznie pobierz dane social media
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
    
    // Zaktualizuj tablicę usług
    if (Array.isArray(specialistProfile.services)) {
      console.log("Ustawianie tablicy usług:", specialistProfile.services);
      
      // Jeśli mamy jakieś usługi w profilu
      if (specialistProfile.services.length > 0) {
        // Zainicjalizuj usługi z danymi z profilu
        specialistProfile.services.forEach((svc: string, index: number) => {
          if (index < services.length) {
            updateService(index, svc);
          } else {
            addService();
            updateService(index, svc);
          }
        });
      } else {
        // Upewnij się, że jest przynajmniej jedno puste pole
        if (services.length === 0) {
          addService();
        }
      }
    } else {
      // Jeśli nie ma tablicy usług, dodaj jedno puste pole
      if (services.length === 0) {
        addService();
      }
    }
    
    // Zaktualizuj tablicę edukacji
    if (Array.isArray(specialistProfile.education)) {
      console.log("Ustawianie tablicy edukacji:", specialistProfile.education);
      
      // Jeśli mamy jakieś wpisy edukacji w profilu
      if (specialistProfile.education.length > 0) {
        // Zainicjalizuj edukację z danymi z profilu
        specialistProfile.education.forEach((item: string, index: number) => {
          if (index < education.length) {
            updateEducation(index, item);
          } else {
            addEducation();
            updateEducation(index, item);
          }
        });
      } else {
        // Upewnij się, że jest przynajmniej jedno puste pole
        if (education.length === 0) {
          addEducation();
        }
      }
    } else {
      // Jeśli nie ma tablicy edukacji, dodaj jedno puste pole
      if (education.length === 0) {
        addEducation();
      }
    }
    
    // Resetuj formularz z danymi profilu specjalisty
    profileForm.reset({
      title: specialistProfile.title || "",
      description: specialistProfile.description || "",
      specializations: specializationIds || [], // Użyj ID specjalizacji z tabeli łączącej
      services: specialistProfile.services || [],
      education: specialistProfile.education || [],
      experience: specialistProfile.experience || "",
      location: specialistProfile.location || "",
      phoneNumber: specialistProfile.phone_number || "",
      email: user?.email || "",
      website: specialistProfile.website || "",
      socialMedia
    });
    
    // Ustaw URL zdjęcia jeśli dostępne
    if (specialistProfile.photo_url) {
      handlePhotoChange(specialistProfile.photo_url, null);
    }
    
    // Oznacz jako zainicjalizowane aby zapobiec ponownemu wykonaniu
    initialized.current = true;
  }, [specialistProfile, isLoadingProfile, specializationIds, services, education, addService, updateService, addEducation, updateEducation, profileForm, user?.email, handlePhotoChange]);

  // Aktualizuj specjalizacje gdy zostaną załadowane
  useEffect(() => {
    if (initialized.current && specializationIds && specializationIds.length > 0) {
      console.log("Ustawianie specjalizacji w formularzu:", specializationIds);
      profileForm.setValue('specializations', specializationIds);
    }
  }, [specializationIds, profileForm, initialized.current]);
}
