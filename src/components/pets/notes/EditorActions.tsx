
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface EditorActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  isEditing: boolean;
}

const EditorActions: React.FC<EditorActionsProps> = ({ 
  onCancel, 
  onSave, 
  isSaving, 
  isEditing 
}) => {
  return (
    <div className="flex space-x-2 justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCancel}
      >
        Anuluj
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSave} 
        disabled={isSaving}
      >
        <Save className="h-4 w-4 mr-2" />
        {isEditing ? 'Aktualizuj' : 'Zapisz'}
      </Button>
    </div>
  );
};

export default EditorActions;
