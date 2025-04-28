
import { useState, useEffect } from "react";
import { useProfilePhoto } from "./useProfilePhoto";
import { useProfileArrays } from "./useProfileArrays";
import { useProfileDataProcessor } from "./useProfileDataProcessor";

export function useProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
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

  // Log overall state for debugging - only when these values change
  useEffect(() => {
    console.log('useProfileForm - current state:', {
      services,
      education,
      photoUrl,
      validationErrors
    });
  }, [services, education, photoUrl, validationErrors]);

  // Helper function to validate form data
  const validateForm = (formData: any) => {
    const errors: string[] = [];
    
    // Basic required field validation
    if (!formData.title?.trim()) {
      errors.push("Tytuł jest wymagany");
    }
    
    // Clear any previous errors
    setValidationErrors(errors);
    
    return errors.length === 0;
  };

  return {
    services,
    education,
    photoUrl,
    photoFile,
    isSubmitting,
    isUploading,
    validationErrors,
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
    validateForm,
    setValidationErrors,
  };
}
