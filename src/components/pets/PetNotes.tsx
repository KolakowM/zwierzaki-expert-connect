
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Edit, Upload, File, X, Paperclip, Trash2 } from "lucide-react";
import { Pet } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";

interface PetNotesProps {
  pet: Pet;
}

interface PetNote {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  attachments?: {
    id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
  }[];
}

const PetNotes = ({ pet }: PetNotesProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNoteId, setIsEditingNoteId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<PetNote[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pet_notes')
          .select(`
            id, 
            content, 
            created_at, 
            updated_at,
            pet_note_attachments (
              id, 
              file_name, 
              file_path, 
              file_type, 
              file_size
            )
          `)
          .eq('pet_id', pet.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setNotes(data || []);
        
        if (data && data.length > 0) {
          setContent(data[0].content);
        }
      } catch (error: any) {
        console.error('Error fetching notes:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać notatek",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (pet.id && user) {
      fetchNotes();
    }
  }, [pet.id, toast, user]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const isValid = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValid && isValidSize;
    });
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => {
        const isValid = file.type.startsWith('image/') || file.type === 'application/pdf';
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValid && isValidSize;
      });
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSaveNote = async () => {
    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby zapisać notatkę",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!content.trim()) {
        toast({
          title: "Brak treści",
          description: "Wprowadź treść notatki",
          variant: "destructive"
        });
        return;
      }

      setIsSaving(true);

      // If we're editing a note, update it instead of creating a new one
      if (isEditingNoteId) {
        const { data: updatedNoteData, error: updateError } = await supabase
          .from('pet_notes')
          .update({ 
            content,
            updated_at: new Date().toISOString(),
            user_id: user.id 
          })
          .eq('id', isEditingNoteId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update the note in state
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === isEditingNoteId 
              ? {...updatedNoteData, attachments: note.attachments} 
              : note
          )
        );

        toast({
          title: "Notatka zaktualizowana",
          description: "Zmiany zostały pomyślnie zapisane"
        });

        setIsEditing(false);
        setIsEditingNoteId(null);
        setContent("");
        setFiles([]);
        return;
      }

      // Creating a new note
      const { data: noteData, error: noteError } = await supabase
        .from('pet_notes')
        .insert([{ 
          pet_id: pet.id, 
          content,
          user_id: user.id // Explicitly set the user_id to authenticate the operation
        }])
        .select()
        .single();

      if (noteError) throw noteError;

      const attachments = [];
      
      for (const file of files) {
        // Add user ID to the file path to ensure ownership and improve organization
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        // Include user.id in the path to enforce ownership
        const filePath = `${user.id}/${pet.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet_attachments') // Using the newly created bucket
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: attachmentData, error: attachmentError } = await supabase
          .from('pet_note_attachments')
          .insert([{
            note_id: noteData.id,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            file_path: filePath
          }])
          .select()
          .single();

        if (attachmentError) throw attachmentError;
        
        attachments.push(attachmentData);
      }

      setNotes(prevNotes => [{
        id: noteData.id,
        content: noteData.content,
        created_at: noteData.created_at,
        updated_at: noteData.updated_at,
        attachments: attachments
      }, ...prevNotes]);

      toast({
        title: "Notatka zapisana",
        description: "Notatka została pomyślnie zapisana"
      });

      setIsEditing(false);
      setFiles([]);
      setContent("");
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać notatki: " + (error.message || "Nieznany błąd"),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsEditingNoteId(null);
    setContent("");
    setFiles([]);
  };

  const handleEditNote = (note: PetNote) => {
    setIsEditing(true);
    setIsEditingNoteId(note.id);
    setContent(note.content);
    setFiles([]);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsEditingNoteId(null);
    setContent("");
    setFiles([]);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby usunąć notatkę",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDeleting(true);

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
        .eq('user_id', user.id);

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

      // Update state to remove the deleted note
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));

      toast({
        title: "Notatka usunięta",
        description: "Notatka została pomyślnie usunięta"
      });
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć notatki: " + (error.message || "Nieznany błąd"),
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDownloadUrl = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('pet_attachments') // Updated bucket name
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pet_attachments') // Updated bucket name
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
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać pliku",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notatki</CardTitle>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancelEdit}
            >
              Anuluj
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveNote} 
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditingNoteId ? 'Aktualizuj' : 'Zapisz'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Wprowadź notatkę..."
            />
            
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Przeciągnij pliki lub kliknij aby wybrać
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (max 5MB, .jpg, .pdf)
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : notes.length > 0 ? (
          <div className="space-y-6">
            {notes.map((note) => (
              <div key={note.id} className="border-b pb-4 last:pb-0 last:border-b-0">
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
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <ConfirmDeleteDialog
                      title="Usuń notatkę"
                      description="Czy na pewno chcesz usunąć tę notatkę? Ta operacja jest nieodwracalna."
                      onConfirm={() => handleDeleteNote(note.id)}
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
                
                {note.attachments && note.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium">Załączniki:</p>
                    {note.attachments.map((attachment) => (
                      <div 
                        key={attachment.id} 
                        className="flex items-center text-sm cursor-pointer hover:text-primary"
                        onClick={() => handleDownload(attachment.file_path, attachment.file_name)}
                      >
                        <Paperclip className="h-3 w-3 mr-1" />
                        <span className="underline">{attachment.file_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
