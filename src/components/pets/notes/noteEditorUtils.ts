
import { supabase } from "@/integrations/supabase/client";
import { Pet } from "@/types";
import { PetNote } from "@/hooks/usePetNotes";
import { useToast } from "@/hooks/use-toast";

export interface SaveNoteParams {
  content: string;
  files?: File[];
  pet: Pet;
  userId: string;
  isEditingNoteId: string | null;
  toastFn: ReturnType<typeof useToast>["toast"];
}

export const validateNoteContent = (content: string, files: File[] = [], toast: ReturnType<typeof useToast>["toast"]): boolean => {
  if (!content.trim() && files.length === 0) {
    toast({
      title: "Pusta notatka",
      description: "Wprowadź treść notatki lub dodaj załącznik",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

export const updateExistingNote = async (
  params: SaveNoteParams
) => {
  const { content, files = [], userId, isEditingNoteId, pet, toastFn } = params;
  
  try {
    // 1. Update the note content
    const { data: updatedNoteData, error: updateError } = await supabase
      .from('pet_notes')
      .update({ 
        content: content.trim(),
        updated_at: new Date().toISOString(),
        user_id: userId 
      })
      .eq('id', isEditingNoteId)
      .eq('user_id', userId)
      .select();

    if (updateError) throw updateError;
    
    // 2. Process attachments if any
    const attachmentErrors = [];
    if (files.length > 0) {
      for (const file of files) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          // Include user.id and pet.id in the path for organization
          const filePath = `${userId}/${pet.id}/${isEditingNoteId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('pet_attachments')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { error: attachmentError } = await supabase
            .from('pet_note_attachments')
            .insert([{
              note_id: isEditingNoteId,
              file_name: file.name,
              file_size: file.size,
              file_type: file.type,
              file_path: filePath
            }]);
          
          if (attachmentError) throw attachmentError;

        } catch (error: any) {
          console.error(`Error saving attachment ${file.name}:`, error);
          attachmentErrors.push(`Nie udało się zapisać załącznika "${file.name}": ${error.message || "Nieznany błąd"}`);
        }
      }
    }

    // 3. Fetch the complete note with ALL attachments after update
    const { data: completeNote, error: fetchError } = await supabase
      .from('pet_notes')
      .select(`
        *,
        pet_note_attachments (*)
      `)
      .eq('id', isEditingNoteId)
      .single();

    if (fetchError) throw fetchError;

    // Transform response to match PetNote structure 
    const transformedNote: PetNote = {
      ...completeNote,
      attachments: completeNote.pet_note_attachments
    };

    // Handle any attachment errors
    if (attachmentErrors.length > 0) {
      toastFn({
        title: "Błędy załączników",
        description: attachmentErrors.join("\n"),
        variant: "destructive",
        duration: 10000 // Show for longer
      });
    } else {
      toastFn({
        title: "Notatka zaktualizowana",
        description: "Zmiany zostały pomyślnie zapisane"
      });
    }

    return transformedNote;
  } catch (error: any) {
    console.error("Error updating note:", error);
    throw error;
  }
};

export const createNewNote = async (
  params: SaveNoteParams
) => {
  const { content, files = [], pet, userId, toastFn } = params;
  
  try {
    // Create the note first
    const { data: noteData, error: noteError } = await supabase
      .from('pet_notes')
      .insert([{ 
        pet_id: pet.id, 
        content: content.trim(),
        user_id: userId
      }])
      .select()
      .single();

    if (noteError) throw noteError;
    
    // Process attachments
    const attachmentErrors = [];
    
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          // Add user ID to the file path to ensure ownership and improve organization
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          // Include user.id and pet.id in the path
          const filePath = `${userId}/${pet.id}/${noteData.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('pet_attachments')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

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

        } catch (error: any) {
          console.error(`Error saving attachment ${file.name}:`, error);
          attachmentErrors.push(`Nie udało się zapisać załącznika "${file.name}": ${error.message || "Nieznany błąd"}`);
        }
      }
    }
    
    // Fetch the complete note with ALL attachments
    const { data: completeNote, error: fetchError } = await supabase
      .from('pet_notes')
      .select(`
        *,
        pet_note_attachments (*)
      `)
      .eq('id', noteData.id)
      .single();

    if (fetchError) throw fetchError;
    
    // Transform response to match PetNote structure
    const transformedNote: PetNote = {
      ...completeNote,
      attachments: completeNote.pet_note_attachments
    };
    
    // Handle any attachment errors
    if (attachmentErrors.length > 0) {
      toastFn({
        title: "Błędy załączników",
        description: attachmentErrors.join("\n"),
        variant: "destructive",
        duration: 10000 // Show for longer
      });
    } else {
      toastFn({
        title: "Notatka zapisana",
        description: "Notatka została pomyślnie zapisana"
      });
    }
    
    return transformedNote;
  } catch (error: any) {
    console.error("Error saving note:", error);
    throw error;
  }
};
