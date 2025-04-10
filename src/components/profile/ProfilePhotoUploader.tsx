
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

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Show local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPhotoUrl(previewUrl);
      
      // Pass the file to parent component for later upload
      onPhotoChange(previewUrl, file);
    };
    reader.readAsDataURL(file);
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
