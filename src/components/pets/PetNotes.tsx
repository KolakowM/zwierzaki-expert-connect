
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Edit, Upload, File, X } from "lucide-react";
import { Pet } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PetNotesProps {
  pet: Pet;
}

const PetNotes = ({ pet }: PetNotesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const isValid = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValid && isValidSize;
    });
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => {
        const isValid = file.type.startsWith('image/') || file.type === 'application/pdf';
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValid && isValidSize;
      });
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSaveNote = async () => {
    try {
      setIsSaving(true);

      // Create the note
      const { data: noteData, error: noteError } = await supabase
        .from('pet_notes')
        .insert([{ pet_id: pet.id, content }])
        .select()
        .single();

      if (noteError) throw noteError;

      // Upload files
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${pet.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet_attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create attachment record
        const { error: attachmentError } = await supabase
          .from('pet_note_attachments')
          .insert([{
            note_id: noteData.id,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            file_path: filePath
          }]);

        if (attachmentError) throw attachmentError;
      }

      toast({
        title: "Notatka zapisana",
        description: "Notatka została pomyślnie zapisana"
      });

      setIsEditing(false);
      setFiles([]);
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać notatki",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notatki</CardTitle>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveNote} 
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            Zapisz
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Wprowadź notatkę..."
            />
            
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Przeciągnij pliki lub kliknij aby wybrać
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (max 5MB, .jpg, .pdf)
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : content ? (
          <p>{content}</p>
        ) : (
          <p className="text-muted-foreground">Brak notatek dla tego zwierzęcia.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PetNotes;
