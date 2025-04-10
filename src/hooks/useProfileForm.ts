
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SocialMediaLinks } from "@/types";

export function useProfileForm() {
  const { toast } = useToast();
  const [services, setServices] = useState<string[]>([""]);
  const [education, setEducation] = useState<string[]>([""]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load existing profile data (to be implemented in a future feature)
  useEffect(() => {
    // Load existing profile data and set initial states
  }, []);

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
    setServices([...services, ""]);
  };

  // Update a service at specific index
  const updateService = (index: number, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
    return updatedServices.filter(service => service.trim() !== "");
  };

  // Remove a service at specific index
  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
    return updatedServices.filter(service => service.trim() !== "");
  };

  // Add a new education input field
  const addEducation = () => {
    setEducation([...education, ""]);
  };

  // Update education at specific index
  const updateEducation = (index: number, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = value;
    setEducation(updatedEducation);
    return updatedEducation.filter(item => item.trim() !== "");
  };

  // Remove education at specific index
  const removeEducation = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
    return updatedEducation.filter(item => item.trim() !== "");
  };

  // Handle photo change
  const handlePhotoChange = (url: string | null, file: File | null) => {
    console.log('Photo changed:', { url, file });
    setPhotoUrl(url);
    setPhotoFile(file);
  };

  // Process form data for saving to database
  const processFormData = (formData: any, userId: string | undefined, photoUrl: string | null = null) => {
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
    
    // Create the payload
    return {
      id: userId,
      title: formData.title,
      description: formData.description,
      specializations: formData.specializations,
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
