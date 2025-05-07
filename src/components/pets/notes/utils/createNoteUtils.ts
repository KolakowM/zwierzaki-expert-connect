
import { supabase } from "@/integrations/supabase/client";
import { SaveNoteParams } from "../types/noteTypes";
import { processAttachments } from "./fileUtils";
import { fetchCompleteNote } from "./noteDataUtils";
import { PetNote } from "@/hooks/usePetNotes";

export const createNewNote = async (
  params: SaveNoteParams
): Promise<PetNote> => {
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
    const { attachmentErrors } = await processAttachments(
      files, 
      noteData.id, 
      userId, 
      pet.id, 
      toastFn
    );
    
    // Fetch the complete note with ALL attachments
    const transformedNote = await fetchCompleteNote(noteData.id);
    
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
