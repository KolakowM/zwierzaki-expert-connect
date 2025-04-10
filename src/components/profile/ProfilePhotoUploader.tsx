
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

interface ProfilePhotoUploaderProps {
  initialPhotoUrl: string | null;
  userId: string | undefined;
  onPhotoChange: (url: string | null, file: File | null) => void;
}

export function ProfilePhotoUploader({
  initialPhotoUrl,
  userId,
  onPhotoChange,
}: ProfilePhotoUploaderProps) {
  const { toast } = useToast();
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Pass the file and current preview URL to parent component
      onPhotoChange(photoUrl, file);
    }
  };

  const uploadProfilePhoto = async (photoFile: File): Promise<string | null> => {
    if (!photoFile || !userId) return null;
    
    setIsUploading(true);
    try {
      // Create a unique file name
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, photoFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
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

  return (
    <div className="space-y-4">
      <FormLabel>Zdjęcie profilowe</FormLabel>
      <div className="flex items-center gap-6">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-muted">
          <Avatar className="h-full w-full">
            {photoUrl ? (
              <AvatarImage src={photoUrl} alt="Zdjęcie profilowe" className="object-cover" />
            ) : (
              <AvatarFallback className="bg-muted">
                <Camera className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="flex flex-col space-y-2">
          <Input 
            id="photo" 
            type="file" 
            accept="image/*" 
            onChange={handlePhotoChange} 
            className="w-full"
            disabled={isUploading} 
          />
          <p className="text-xs text-muted-foreground">
            Zalecany format: JPG lub PNG. Maksymalny rozmiar: 5MB
          </p>
          {isUploading && (
            <p className="text-xs text-blue-600">
              Przesyłanie zdjęcia...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
