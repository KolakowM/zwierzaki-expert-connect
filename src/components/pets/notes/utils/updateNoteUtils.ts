
import { supabase } from "@/integrations/supabase/client";
import { SaveNoteParams } from "../types/noteTypes";
import { processAttachments } from "./fileUtils";
import { fetchCompleteNote } from "./noteDataUtils";
import { PetNote } from "@/hooks/usePetNotes";

export const updateExistingNote = async (
  params: SaveNoteParams
): Promise<PetNote> => {
  const { content, files = [], userId, isEditingNoteId, pet, toastFn } = params;
  
  try {
    // 1. Update the note content
    const { error: updateError } = await supabase
      .from('pet_notes')
      .update({ 
        content: content.trim(),
        updated_at: new Date().toISOString(),
        user_id: userId 
      })
      .eq('id', isEditingNoteId)
      .eq('user_id', userId);

    if (updateError) throw updateError;
    
    // 2. Process attachments if any
    const { attachmentErrors } = await processAttachments(
      files, 
      isEditingNoteId as string, 
      userId, 
      pet.id, 
      toastFn
    );

    // 3. Fetch the complete note with ALL attachments after update
    const transformedNote = await fetchCompleteNote(isEditingNoteId as string);

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
