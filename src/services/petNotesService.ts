
import { supabase } from "@/integrations/supabase/client";
import { PetNote } from "@/hooks/usePetNotes";
import { Pet } from "@/types";

/**
 * Fetches pet notes with attachments from the database
 */
export const fetchPetNotes = async (petId: string) => {
  const { data, error } = await supabase
    .from('pet_notes')
    .select(`
      *,
      pet_note_attachments (*)
    `)
    .eq('pet_id', petId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Deletes a note and its attachments
 */
export const deletePetNote = async (noteId: string, userId: string) => {
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
    .eq('user_id', userId);

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
};

/**
 * Creates a download URL for a file in storage
 */
export const getDownloadUrl = async (filePath: string) => {
  const { data } = await supabase.storage
    .from('pet_attachments')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

/**
 * Downloads a file from storage
 */
export const downloadFile = async (filePath: string, fileName: string) => {
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
};
