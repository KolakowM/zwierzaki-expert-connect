
import { Pet } from "@/types";
import { useToast } from "@/hooks/use-toast";

export interface SaveNoteParams {
  content: string;
  files?: File[];
  pet: Pet;
  userId: string;
  isEditingNoteId: string | null;
  toastFn: ReturnType<typeof useToast>["toast"];
}

export interface NoteAttachment {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}
