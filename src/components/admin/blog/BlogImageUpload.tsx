import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

interface BlogImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function BlogImageUpload({ value, onChange }: BlogImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Błąd",
        description: "Dozwolone są tylko pliki JPG, PNG i WebP.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      toast({
        title: "Błąd",
        description: "Maksymalny rozmiar pliku to 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      onChange(data.publicUrl);

      toast({
        title: "Sukces",
        description: "Zdjęcie zostało przesłane.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się przesłać zdjęcia.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      <Label>Zdjęcie wyróżniające</Label>
      
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Podgląd zdjęcia"
            className="w-full h-48 object-cover rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="mt-4">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <span className="text-primary hover:underline">
                Wybierz plik
              </span>
              <span className="text-muted-foreground"> lub przeciągnij tutaj</span>
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG lub WebP (max. 5MB)
          </p>
        </div>
      )}

      {uploading && (
        <p className="text-sm text-muted-foreground">Przesyłanie...</p>
      )}
    </div>
  );
}
