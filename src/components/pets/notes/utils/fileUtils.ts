
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UploadFileParams {
  file: File;
  userId: string;
  petId: string;
  noteId: string;
}

export const uploadFileToStorage = async (params: UploadFileParams) => {
  const { file, userId, petId, noteId } = params;
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${userId}/${petId}/${noteId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('pet_attachments')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  return { filePath, originalName: file.name, fileType: file.type, fileSize: file.size };
};

export const createAttachmentRecord = async (
  noteId: string,
  fileName: string,
  filePath: string,
  fileType: string,
  fileSize: number
) => {
  const { error } = await supabase
    .from('pet_note_attachments')
    .insert([{
      note_id: noteId,
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType,
      file_path: filePath
    }]);

  if (error) throw error;
};

export const processAttachments = async (
  files: File[],
  noteId: string,
  userId: string,
  petId: string,
  toastFn: ReturnType<typeof useToast>["toast"]
) => {
  const attachmentErrors: string[] = [];

  if (files && files.length > 0) {
    for (const file of files) {
      try {
        const { filePath, originalName, fileType, fileSize } = await uploadFileToStorage({
          file,
          userId,
          petId,
          noteId
        });

        await createAttachmentRecord(noteId, originalName, filePath, fileType, fileSize);
      } catch (error: any) {
        console.error(`Error saving attachment ${file.name}:`, error);
        attachmentErrors.push(`Nie udało się zapisać załącznika "${file.name}": ${error.message || "Nieznany błąd"}`);
      }
    }
  }

  return { attachmentErrors };
};
