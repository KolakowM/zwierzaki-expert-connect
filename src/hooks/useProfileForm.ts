
import { useState, useEffect } from "react";
import { useProfilePhoto } from "./useProfilePhoto";
import { useProfileArrays } from "./useProfileArrays";
import { useProfileDataProcessor } from "./useProfileDataProcessor";

export function useProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Import and use the specialized hooks
  const {
    photoUrl,
    photoFile,
    isUploading,
    uploadProfilePhoto,
    handlePhotoChange
  } = useProfilePhoto();
  
  const {
    services,
    education,
    setServices,
    setEducation,
    addService,
    updateService,
    removeService,
    addEducation,
    updateEducation,
    removeEducation
  } = useProfileArrays();
  
  const { processFormData } = useProfileDataProcessor();

  // Log overall state for debugging
  useEffect(() => {
    console.log('useProfileForm - current state:', {
      services,
      education,
      photoUrl
    });
  }, [services, education, photoUrl]);

  return {
    services,
    education,
    photoUrl,
    photoFile,
    isSubmitting,
    isUploading,
    setIsSubmitting,
    setServices,
    setEducation,
    uploadProfilePhoto,
    addService,
    updateService,
    removeService,
    addEducation,
    updateEducation,
    removeEducation,
    handlePhotoChange,
    processFormData,
  };
}
