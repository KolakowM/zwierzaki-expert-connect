
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, X, Upload, File } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/types";
import { PetNote } from "@/hooks/usePetNotes";

interface PetNoteEditorProps {
  pet: Pet;
  onSave: (note: PetNote) => void;
  onCancel: () => void;
  initialContent?: string;
  isEditingNoteId?: string | null;
}

const PetNoteEditor: React.FC<PetNoteEditorProps> = ({
  pet,
  onSave,
  onCancel,
  initialContent = "",
  isEditingNoteId = null
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const isValid = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValid && isValidSize;
    });
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  };

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
    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby zapisać notatkę",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!content.trim()) {
        toast({
          title: "Brak treści",
          description: "Wprowadź treść notatki",
          variant: "destructive"
        });
        return;
      }

      setIsSaving(true);

      // If we're editing a note, update it instead of creating a new one
      if (isEditingNoteId) {
        const { data: updatedNoteData, error: updateError } = await supabase
          .from('pet_notes')
          .update({ 
            content,
            updated_at: new Date().toISOString(),
            user_id: user.id 
          })
          .eq('id', isEditingNoteId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Get existing attachments for this note to include in the response
        const { data: existingAttachments, error: attachmentsError } = await supabase
          .from('pet_note_attachments')
          .select('id, file_name, file_path, file_type, file_size')
          .eq('note_id', isEditingNoteId);

        if (attachmentsError) throw attachmentsError;

        // Create a complete note object with existing attachments
        const completeNote: PetNote = {
          ...updatedNoteData,
          attachments: existingAttachments || []
        };

        // Update the note in state
        onSave(completeNote);

        toast({
          title: "Notatka zaktualizowana",
          description: "Zmiany zostały pomyślnie zapisane"
        });

        return;
      }

      // Creating a new note
      const { data: noteData, error: noteError } = await supabase
        .from('pet_notes')
        .insert([{ 
          pet_id: pet.id, 
          content,
          user_id: user.id // Explicitly set the user_id to authenticate the operation
        }])
        .select()
        .single();

      if (noteError) throw noteError;

      const attachments = [];
      
      for (const file of files) {
        // Add user ID to the file path to ensure ownership and improve organization
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        // Include user.id in the path to enforce ownership
        const filePath = `${user.id}/${pet.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet_attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: attachmentData, error: attachmentError } = await supabase
          .from('pet_note_attachments')
          .insert([{
            note_id: noteData.id,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            file_path: filePath
          }])
          .select()
          .single();

        if (attachmentError) throw attachmentError;
        
        attachments.push(attachmentData);
      }

      // Create a complete note object with attachments
      const completeNote: PetNote = {
        id: noteData.id,
        content: noteData.content,
        created_at: noteData.created_at,
        updated_at: noteData.updated_at,
        attachments: attachments
      };

      onSave(completeNote);

      toast({
        title: "Notatka zapisana",
        description: "Notatka została pomyślnie zapisana"
      });
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać notatki: " + (error.message || "Nieznany błąd"),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
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

      <div className="flex space-x-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
        >
          Anuluj
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSaveNote} 
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isEditingNoteId ? 'Aktualizuj' : 'Zapisz'}
        </Button>
      </div>
    </div>
  );
};

export default PetNoteEditor;
