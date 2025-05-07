
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pet } from "@/types";
import { useAuth } from "@/contexts/AuthProvider";
import { 
  fetchPetNotes, 
  deletePetNote, 
  getDownloadUrl,
  downloadFile
} from "@/services/petNotesService";

export interface PetNote {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  pet_note_attachments?: Array<{
    id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
  }>;
  attachments?: Array<{
    id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
  }>;
}

export const usePetNotes = (pet: Pet) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<PetNote[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const loadNotes = useCallback(async () => {
    if (!user || !pet.id) {
      console.error('No authenticated user found or pet id is missing');
      return;
    }

    try {
      setIsLoading(true);
      const notesData = await fetchPetNotes(pet.id);
      
      // Transform notes to ensure they have consistent structure
      const transformedNotes = notesData.map((note) => ({
        ...note,
        attachments: note.pet_note_attachments || []
      }));
      
      setNotes(transformedNotes || []);
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
      await deletePetNote(noteId, user.id);
      
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

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      await downloadFile(filePath, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać pliku",
        variant: "destructive"
      });
    }
  };

  // Use useEffect for initial fetch
  useEffect(() => {
    if (pet.id && user) {
      loadNotes();
    }
  }, [pet.id, user, loadNotes]);

  return {
    notes,
    isLoading,
    isDeleting,
    handleDeleteNote,
    getDownloadUrl,
    handleDownload,
    setNotes,
    fetchNotes: loadNotes
  };
};
