
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pet } from "@/types";

interface PetHeaderProps {
  pet: Pet;
  clientId: string;
  actionButton?: React.ReactNode;
}

const PetHeader = ({ pet, clientId, actionButton }: PetHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <PawPrint className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">{pet.name}</h1>
      </div>
      
      {actionButton && (
        <div className="ml-auto">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default PetHeader;
