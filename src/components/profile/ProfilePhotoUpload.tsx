
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ProfilePhotoUploadProps {
  photoUrl: string | null;
  userId: string | undefined;
  onPhotoChange: (url: string | null, file: File | null) => void;
}

export function ProfilePhotoUpload({ photoUrl, userId, onPhotoChange }: ProfilePhotoUploadProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Nieprawidłowy format pliku');
      return;
    }

    // Create a temporary URL for preview
    const previewUrl = URL.createObjectURL(file);
    onPhotoChange(previewUrl, file);
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null, null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="relative cursor-pointer group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Avatar className="w-24 h-24 border-2 border-gray-200">
          <AvatarImage src={photoUrl || undefined} alt="Zdjęcie profilowe" />
          <AvatarFallback className="bg-primary/10 text-primary text-xl">
            {userId?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-6 h-6 text-white" />
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" size="sm" asChild>
          <label htmlFor="photo-upload" className="cursor-pointer">
            {photoUrl ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
          </label>
        </Button>
        
        {photoUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500" 
            onClick={handleRemovePhoto}
          >
            <X className="w-4 h-4 mr-1" />
            Usuń
          </Button>
        )}
        
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
