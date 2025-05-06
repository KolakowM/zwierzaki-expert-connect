
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pet } from "@/types";
import { usePetNotes, PetNote } from "@/hooks/usePetNotes";
import PetNoteEditor from "./notes/PetNoteEditor";
import PetNoteItem from "./notes/PetNoteItem";
import PetNotesHeader from "./notes/PetNotesHeader";

interface PetNotesProps {
  pet: Pet;
}

const PetNotes = ({ pet }: PetNotesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNoteId, setIsEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  
  const {
    notes,
    isLoading,
    isDeleting,
    handleDeleteNote,
    handleDownload,
    setNotes
  } = usePetNotes(pet);

  const handleEdit = () => {
    setIsEditing(true);
    setIsEditingNoteId(null);
    setEditingContent("");
  };

  const handleEditNote = (note: PetNote) => {
    setIsEditing(true);
    setIsEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsEditingNoteId(null);
    setEditingContent("");
  };

  const handleSaveNote = (savedNote: PetNote) => {
    if (isEditingNoteId) {
      // Update existing note in the notes array
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === isEditingNoteId 
            ? {...note, content: savedNote.content, updated_at: savedNote.updated_at} 
            : note
        )
      );
    } else {
      // Add new note to the beginning of the notes array
      setNotes(prevNotes => [savedNote, ...prevNotes]);
    }
    
    // Reset editing state
    setIsEditing(false);
    setIsEditingNoteId(null);
    setEditingContent("");
  };

  return (
    <Card>
      <PetNotesHeader isEditing={isEditing} onEdit={handleEdit} />
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isEditing ? (
          <PetNoteEditor
            pet={pet}
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
            initialContent={editingContent}
            isEditingNoteId={isEditingNoteId}
          />
        ) : notes.length > 0 ? (
          <div className="space-y-6">
            {notes.map((note) => (
              <PetNoteItem
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onDownload={handleDownload}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Brak notatek dla tego zwierzęcia.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PetNotes;
