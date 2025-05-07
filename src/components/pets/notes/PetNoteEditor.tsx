
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Pet } from "@/types";
import { PetNote } from "@/hooks/usePetNotes";
import AttachmentList from "./AttachmentList";
import FileDropZone from "./FileDropZone";
import EditorActions from "./EditorActions";
import { 
  validateNoteContent, 
  createNewNote, 
  updateExistingNote 
} from "./noteEditorUtils";

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

    // Validate content
    if (!validateNoteContent(content, toast)) {
      return;
    }

    try {
      setIsSaving(true);

      let savedNote;
      
      // If we're editing a note
      if (isEditingNoteId) {
        savedNote = await updateExistingNote({
          content,
          userId: user.id,
          isEditingNoteId,
          pet,
          toastFn: toast
        });
      } else {
        // Creating a new note
        savedNote = await createNewNote({
          content,
          files,
          pet,
          userId: user.id,
          isEditingNoteId,
          toastFn: toast
        });
      }

      onSave(savedNote);
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
      
      <FileDropZone 
        onDrop={handleDrop} 
        onFileSelect={handleFileSelect} 
      />

      <AttachmentList 
        files={files} 
        onRemoveFile={removeFile} 
      />

      <EditorActions 
        onCancel={onCancel} 
        onSave={handleSaveNote} 
        isSaving={isSaving} 
        isEditing={!!isEditingNoteId}
      />
    </div>
  );
};

export default PetNoteEditor;
