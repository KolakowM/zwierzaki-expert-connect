
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Paperclip } from "lucide-react";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { PetNote } from "@/hooks/usePetNotes";
import { formatDate } from "@/utils/formatters";

interface PetNoteItemProps {
  note: PetNote;
  onEdit: (note: PetNote) => void;
  onDelete: (noteId: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  isDeleting: boolean;
}

const PetNoteItem: React.FC<PetNoteItemProps> = ({
  note,
  onEdit,
  onDelete,
  onDownload,
  isDeleting
}) => {
  // Verify if attachments exists and has length
  const hasAttachments = note.attachments && note.attachments.length > 0;
  
  return (
    <div className="border-b pb-4 last:pb-0 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-muted-foreground">
          {formatDate(note.created_at)}
          {note.updated_at !== note.created_at && (
            <span className="text-xs ml-2 italic">(edytowano: {formatDate(note.updated_at)})</span>
          )}
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(note)}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <ConfirmDeleteDialog
            title="Usuń notatkę"
            description="Czy na pewno chcesz usunąć tę notatkę? Ta operacja jest nieodwracalna."
            onConfirm={() => onDelete(note.id)}
            triggerButtonSize="sm"
            triggerButtonVariant="ghost"
          >
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          </ConfirmDeleteDialog>
        </div>
      </div>
      <p className="whitespace-pre-wrap">{note.content}</p>
      
      {hasAttachments && (
        <div className="mt-2 space-y-1">
          <p className="text-sm font-medium">Załączniki:</p>
          {note.attachments.map((attachment) => (
            <div 
              key={attachment.id} 
              className="flex items-center text-sm cursor-pointer hover:text-primary"
              onClick={() => onDownload(attachment.file_path, attachment.file_name)}
            >
              <Paperclip className="h-3 w-3 mr-1" />
              <span className="underline">{attachment.file_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetNoteItem;
