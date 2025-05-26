
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteCareProgramWithRelatedData } from "@/services/careProgramService";

interface DeleteCareProgramButtonProps {
  programId: string;
  programName: string;
  onProgramDeleted: () => void;
}

const DeleteCareProgramButton = ({ 
  programId, 
  programName, 
  onProgramDeleted 
}: DeleteCareProgramButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    if (confirm(`Czy na pewno chcesz usunąć program opieki "${programName}"?`)) {
      try {
        await deleteCareProgramWithRelatedData(programId);
        onProgramDeleted();
        
        toast({
          title: "Program opieki usunięty",
          description: `Program "${programName}" został pomyślnie usunięty`
        });
      } catch (error) {
        console.error("Error deleting care program:", error);
        toast({
          title: "Błąd podczas usuwania",
          description: "Nie udało się usunąć programu opieki. Spróbuj ponownie.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="text-red-500 hover:text-red-700"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};

export default DeleteCareProgramButton;
