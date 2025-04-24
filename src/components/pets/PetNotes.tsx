
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Edit, Upload, File, X, Paperclip } from "lucide-react";
import { Pet } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<PetNote[]>([]);
  const { toast } = useToast();

  // Fetch notes when component mounts
  useEffect(() => {
    const fetchNotes = async () => {
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
        
        // If we have notes, use the most recent one to set the content
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

    if (pet.id) {
      fetchNotes();
    }
  }, [pet.id, toast]);

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

      // Create the note
      const { data: noteData, error: noteError } = await supabase
        .from('pet_notes')
        .insert([{ pet_id: pet.id, content }])
        .select()
        .single();

      if (noteError) throw noteError;

      // Upload files
      const attachments = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${pet.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet_attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create attachment record
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

      // Add the new note to the state
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
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać notatki",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
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
      .from('pet_attachments')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const publicUrl = await getDownloadUrl(filePath);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveNote} 
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            Zapisz
          </Button>
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
                <div className="text-sm text-muted-foreground mb-1">
                  {formatDate(note.created_at)}
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
