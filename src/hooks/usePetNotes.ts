
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { Pet } from "@/types";

export interface PetNote {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  attachments?: {
    id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
  }[];
}

export const usePetNotes = (pet: Pet) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<PetNote[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pet_notes')
          .select(`
            id, 
            content, 
            created_at, 
            updated_at,
            pet_note_attachments (
              id, 
              file_name, 
              file_path, 
              file_type, 
              file_size
            )
          `)
          .eq('pet_id', pet.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setNotes(data || []);
      } catch (error: any) {
        console.error('Error fetching notes:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać notatek",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (pet.id && user) {
      fetchNotes();
    }
  }, [pet.id, toast, user]);

  const handleDeleteNote = async (noteId: string) => {
    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby usunąć notatkę",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDeleting(true);

      // First get attachments to delete from storage later
      const { data: attachments } = await supabase
        .from('pet_note_attachments')
        .select('file_path')
        .eq('note_id', noteId);

      // Delete attachments from the database
      const { error: attachmentsError } = await supabase
        .from('pet_note_attachments')
        .delete()
        .eq('note_id', noteId);

      if (attachmentsError) throw attachmentsError;

      // Delete note from database
      const { error: noteError } = await supabase
        .from('pet_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (noteError) throw noteError;

      // Delete attachment files from storage if any
      if (attachments && attachments.length > 0) {
        const filePaths = attachments.map(attachment => attachment.file_path);
        
        const { error: storageError } = await supabase.storage
          .from('pet_attachments')
          .remove(filePaths);

        if (storageError) {
          console.error("Error deleting files from storage:", storageError);
          // Continue execution even if file deletion fails
        }
      }

      // Update state to remove the deleted note
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));

      toast({
        title: "Notatka usunięta",
        description: "Notatka została pomyślnie usunięta"
      });
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć notatki: " + (error.message || "Nieznany błąd"),
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getDownloadUrl = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('pet_attachments')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pet_attachments')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać pliku",
        variant: "destructive"
      });
    }
  };

  return {
    notes,
    isLoading,
    isDeleting,
    handleDeleteNote,
    getDownloadUrl,
    handleDownload,
    setNotes
  };
};
