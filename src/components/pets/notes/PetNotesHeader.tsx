
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface PetNotesHeaderProps {
  isEditing: boolean;
  onEdit: () => void;
}

const PetNotesHeader: React.FC<PetNotesHeaderProps> = ({ isEditing, onEdit }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Notatki</CardTitle>
      {!isEditing && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </CardHeader>
  );
};

export default PetNotesHeader;
