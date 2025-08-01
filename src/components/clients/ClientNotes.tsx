
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Edit } from "lucide-react";
import { Client } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";

interface ClientNotesProps {
  client: Client;
}

const ClientNotes = ({ client }: ClientNotesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(client.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Update local state if client prop changes
  useEffect(() => {
    setNotes(client.notes || "");
  }, [client.notes]);

  const handleSaveNotes = async () => {
    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany aby zapisać notatki",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('clients')
        .update({ 
          notes: notes,
          user_id: user.id // Explicitly set user_id to ensure it's properly tracked
        })
        .eq('id', client.id)
        .eq('user_id', user.id); // Make sure we're only updating if the user owns the record
        
      if (error) {
        console.error("Error saving notes:", error);
        throw error;
      }
      
      toast({
        title: "Notatki zapisane",
        description: "Zmiany zostały pomyślnie zapisane"
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving notes:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać notatek: " + (error.message || "Nieznany błąd"),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notatki</CardTitle>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveNotes} 
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            Zapisz
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Wprowadź notatki dotyczące klienta..."
          />
        ) : client.notes ? (
          <p className="whitespace-pre-wrap">{client.notes}</p>
        ) : (
          <p className="text-muted-foreground">Brak notatek dla tego klienta.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientNotes;
