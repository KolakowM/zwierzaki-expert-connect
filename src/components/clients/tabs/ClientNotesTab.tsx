
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Client } from '@/types';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { PlusCircle, Save, FileTextIcon, Trash2 } from 'lucide-react';

// Simple type for client notes
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Mock function to handle notes - this would be replaced with real API calls
const useMockNotes = (clientId: string) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulated loading of notes
  useEffect(() => {
    setTimeout(() => {
      // Mock data
      setNotes([
        {
          id: '1',
          title: 'Notatka z konsultacji telefonicznej',
          content: '<p>Klient zgłosił problem z karmieniem zwierzęcia. Zalecono konsultację stacjonarną.</p>',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Przypomnienie o kontroli',
          content: '<p>Zaplanować telefon z przypomnieniem o kontroli za 2 tygodnie.</p>',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, [clientId]);
  
  return { notes, setNotes, isLoading };
};

interface ClientNotesTabProps {
  client: Client;
}

const ClientNotesTab = ({ client }: ClientNotesTabProps) => {
  const { toast } = useToast();
  const { notes, setNotes, isLoading } = useMockNotes(client.id);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateNote = () => {
    setIsCreating(true);
    setTitle('');
    setContent('');
  };

  const handleEditNote = (note: Note) => {
    setIsEditing(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleSaveNote = () => {
    if (!title.trim()) {
      toast({
        title: "Tytuł jest wymagany",
        description: "Proszę podać tytuł notatki",
        variant: "destructive"
      });
      return;
    }

    if (isCreating) {
      // Add new note
      const newNote: Note = {
        id: Date.now().toString(), // In a real app, this would be a proper UUID
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setNotes([newNote, ...notes]);
      toast({
        title: "Notatka utworzona",
        description: "Notatka została pomyślnie dodana"
      });
    } else if (isEditing) {
      // Update existing note
      const updatedNotes = notes.map(note => 
        note.id === isEditing 
          ? { ...note, title, content, updatedAt: new Date().toISOString() } 
          : note
      );
      
      setNotes(updatedNotes);
      toast({
        title: "Notatka zaktualizowana",
        description: "Zmiany zostały pomyślnie zapisane"
      });
    }
    
    setIsCreating(false);
    setIsEditing(null);
    setTitle('');
    setContent('');
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć tę notatkę?')) {
      setNotes(notes.filter(note => note.id !== id));
      
      if (isEditing === id) {
        setIsEditing(null);
        setTitle('');
        setContent('');
      }
      
      toast({
        title: "Notatka usunięta",
        description: "Notatka została pomyślnie usunięta"
      });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(null);
    setTitle('');
    setContent('');
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Notes List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Notatki</CardTitle>
          <CardDescription>
            Notatki związane z klientem {client.firstName} {client.lastName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button 
              onClick={handleCreateNote} 
              disabled={isCreating || isEditing !== null}
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nowa notatka
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notes.length > 0 ? (
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {notes.map(note => (
                  <Card 
                    key={note.id} 
                    className={`cursor-pointer hover:bg-accent/50 transition-colors ${isEditing === note.id ? 'border-primary' : ''}`}
                    onClick={() => !isCreating && !isEditing && handleEditNote(note)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{note.title}</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(note.updatedAt)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">Brak notatek</h3>
              <p className="text-muted-foreground mt-1">
                Dodaj pierwszą notatkę dla tego klienta
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note Editor */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {isCreating ? 'Nowa notatka' : isEditing ? 'Edytuj notatkę' : 'Szczegóły notatki'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(isCreating || isEditing) ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Tytuł</label>
                <input
                  id="title"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tytuł notatki"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Zawartość</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Wpisz treść notatki..."
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Anuluj
                </Button>
                <Button onClick={handleSaveNote}>
                  <Save className="mr-2 h-4 w-4" />
                  Zapisz notatkę
                </Button>
              </div>
            </div>
          ) : isEditing === null && !isCreating ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <FileTextIcon className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-lg font-medium">Wybierz notatkę z listy</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                lub utwórz nową notatkę klikając przycisk "Nowa notatka"
              </p>
              <Button onClick={handleCreateNote}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nowa notatka
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNotesTab;
