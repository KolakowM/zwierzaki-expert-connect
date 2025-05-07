
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/types";
import { PetNote } from "@/hooks/usePetNotes";
import { useToast } from "@/hooks/use-toast";

export interface SaveNoteParams {
  content: string;
  files: File[];
  pet: Pet;
  userId: string;
  isEditingNoteId: string | null;
}

export const validateNoteContent = (content: string, toast: ReturnType<typeof useToast>["toast"]): boolean => {
  if (!content.trim()) {
    toast({
      title: "Brak treści",
      description: "Wprowadź treść notatki",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

export const updateExistingNote = async (
  params: Omit<SaveNoteParams, "files"> & { toastFn: ReturnType<typeof useToast>["toast"] }
) => {
  const { content, userId, isEditingNoteId, toastFn } = params;
  
  try {
    const { data: updatedNoteData, error: updateError } = await supabase
      .from('pet_notes')
      .update({ 
        content,
        updated_at: new Date().toISOString(),
        user_id: userId 
      })
      .eq('id', isEditingNoteId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    toastFn({
      title: "Notatka zaktualizowana",
      description: "Zmiany zostały pomyślnie zapisane"
    });

    return {
      ...updatedNoteData,
      attachments: [] // Will be populated by the parent component
    };
  } catch (error: any) {
    console.error("Error updating note:", error);
    throw error;
  }
};

export const createNewNote = async (
  params: SaveNoteParams & { toastFn: ReturnType<typeof useToast>["toast"] }
) => {
  const { content, files, pet, userId, toastFn } = params;
  
  try {
    // Create the note first
    const { data: noteData, error: noteError } = await supabase
      .from('pet_notes')
      .insert([{ 
        pet_id: pet.id, 
        content,
        user_id: userId
      }])
      .select()
      .single();

    if (noteError) throw noteError;
    
    // Then handle file uploads and attachments
    const attachments = await uploadAttachments(files, pet.id, userId, noteData.id);
    
    toastFn({
      title: "Notatka zapisana",
      description: "Notatka została pomyślnie zapisana"
    });
    
    return {
      id: noteData.id,
      content: noteData.content,
      created_at: noteData.created_at,
      updated_at: noteData.updated_at,
      attachments
    };
  } catch (error: any) {
    console.error("Error saving note:", error);
    throw error;
  }
};

const uploadAttachments = async (
  files: File[], 
  petId: string, 
  userId: string, 
  noteId: string
) => {
  const attachments = [];
  
  for (const file of files) {
    // Add user ID to the file path to ensure ownership and improve organization
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    // Include user.id in the path to enforce ownership
    const filePath = `${userId}/${petId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pet_attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: attachmentData, error: attachmentError } = await supabase
      .from('pet_note_attachments')
      .insert([{
        note_id: noteId,
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
  
  return attachments;
};
