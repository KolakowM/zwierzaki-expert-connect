
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useProfilePhoto() {
  const { toast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // Handle photo change
  const handlePhotoChange = (url: string | null, file: File | null) => {
    console.log('Photo changed:', { url, file });
    setPhotoUrl(url);
    setPhotoFile(file);
  };

  return {
    photoUrl,
    photoFile,
    isUploading,
    uploadProfilePhoto,
    handlePhotoChange
  };
}
