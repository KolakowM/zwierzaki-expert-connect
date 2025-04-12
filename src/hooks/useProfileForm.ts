
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useProfileForm() {
  const { toast } = useToast();
  const [services, setServices] = useState<string[]>([""]);
  const [education, setEducation] = useState<string[]>([""]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log('useProfileForm - current state:', {
      services,
      education,
      photoUrl
    });
  }, [services, education, photoUrl]);

  // Upload photo to Supabase storage
  const uploadProfilePhoto = async (userId: string): Promise<string | null> => {
    if (!photoFile || !userId) return null;
    
    setIsUploading(true);
    try {
      console.log('Uploading profile photo for user:', userId);
      
      // Create a unique file name
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;
      
      console.log('Upload path:', filePath);
      
      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('profiles')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      console.log('Upload successful:', data);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      console.log('Public URL:', urlData.publicUrl);
      
      toast({
        title: "Zdjęcie przesłane",
        description: "Zdjęcie profilowe zostało pomyślnie zaktualizowane."
      });
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się przesłać zdjęcia profilowego",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Add a new service input field
  const addService = () => {
    console.log("Adding new service, current services:", services);
    setServices(prevServices => [...prevServices, ""]);
  };

  // Update a service at specific index
  const updateService = (index: number, value: string) => {
    console.log(`Updating service at index ${index} with value:`, value);
    setServices(prevServices => {
      const updated = [...prevServices];
      if (index >= updated.length) {
        // If index is out of bounds, add new entries
        while (updated.length <= index) {
          updated.push("");
        }
      }
      updated[index] = value;
      return updated;
    });
  };

  // Remove a service at specific index
  const removeService = (index: number) => {
    console.log(`Removing service at index ${index}`);
    setServices(prevServices => {
      const updated = [...prevServices];
      updated.splice(index, 1);
      // Always ensure at least one field
      if (updated.length === 0) {
        updated.push("");
      }
      return updated;
    });
  };

  // Add a new education input field
  const addEducation = () => {
    console.log("Adding new education, current education:", education);
    setEducation(prevEducation => [...prevEducation, ""]);
  };

  // Update education at specific index
  const updateEducation = (index: number, value: string) => {
    console.log(`Updating education at index ${index} with value:`, value);
    setEducation(prevEducation => {
      const updated = [...prevEducation];
      if (index >= updated.length) {
        // If index is out of bounds, add new entries
        while (updated.length <= index) {
          updated.push("");
        }
      }
      updated[index] = value;
      return updated;
    });
  };

  // Remove education at specific index
  const removeEducation = (index: number) => {
    console.log(`Removing education at index ${index}`);
    setEducation(prevEducation => {
      const updated = [...prevEducation];
      updated.splice(index, 1);
      // Always ensure at least one field
      if (updated.length === 0) {
        updated.push("");
      }
      return updated;
    });
  };

  // Handle photo change
  const handlePhotoChange = (url: string | null, file: File | null) => {
    console.log('Photo changed:', { url, file });
    setPhotoUrl(url);
    setPhotoFile(file);
  };

  // Process form data for saving to database
  const processFormData = (formData: any, userId: string | undefined, photoUrl: string | null = null) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    console.log("Processing form data:", formData);
    console.log("Current services:", services);
    console.log("Current education:", education);
    
    // Filter out empty strings from services and education
    const cleanedServices = services.filter(service => service.trim() !== "");
    const cleanedEducation = education.filter(edu => edu.trim() !== "");
    
    // Filter out empty social media links
    const socialMedia: Record<string, string> = {};
    if (formData.socialMedia) {
      Object.entries(formData.socialMedia).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.trim() !== '') {
          socialMedia[key] = value.trim();
        }
      });
    }
    
    // Create the payload without specializations (they're now in the junction table)
    return {
      id: userId,
      title: formData.title,
      description: formData.description,
      services: cleanedServices,
      education: cleanedEducation,
      experience: formData.experience,
      location: formData.location,
      phone_number: formData.phoneNumber,
      website: formData.website,
      social_media: socialMedia,
      photo_url: photoUrl,
      updated_at: new Date().toISOString()
    };
  };

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
