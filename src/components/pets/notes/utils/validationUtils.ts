
import { useToast } from "@/hooks/use-toast";

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
