
import { supabase } from "@/integrations/supabase/client";
import { PetNote } from "@/hooks/usePetNotes";

export const fetchCompleteNote = async (noteId: string): Promise<PetNote> => {
  const { data: completeNote, error: fetchError } = await supabase
    .from('pet_notes')
    .select(`
      *,
      pet_note_attachments (*)
    `)
    .eq('id', noteId)
    .single();

  if (fetchError) throw fetchError;

  // Transform response to match PetNote structure
  const transformedNote: PetNote = {
    ...completeNote,
    attachments: completeNote.pet_note_attachments
  };

  return transformedNote;
};
