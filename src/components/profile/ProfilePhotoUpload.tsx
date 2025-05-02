
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

interface ProfilePhotoUploadProps {
  photoUrl: string | null;
  userId: string | undefined;
  onPhotoChange: (url: string | null, file: File | null) => void;
}

export function ProfilePhotoUpload({ photoUrl, userId, onPhotoChange }: ProfilePhotoUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    onPhotoChange(previewUrl, file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Zdjęcie profilowe</h3>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={`h-24 w-24 rounded-full flex items-center justify-center overflow-hidden border-2 ${
              photoUrl ? "border-primary" : "border-dashed border-gray-300"
            }`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Zdjęcie profilowe"
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleButtonClick}
            >
              <Upload className="h-4 w-4" />
              {photoUrl ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Zalecany format JPG lub PNG, maksymalny rozmiar 2MB
          </p>
        </div>
      </div>
    </div>
  );
}
