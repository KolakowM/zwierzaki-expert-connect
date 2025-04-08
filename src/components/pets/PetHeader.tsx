
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pet } from "@/types";
import { BackButton } from "@/components/ui/back-button";

interface PetHeaderProps {
  pet: Pet;
  clientId: string;
}

const PetHeader = ({ pet, clientId }: PetHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center">
        <BackButton to={`/clients/${clientId}`} label="Powrót do klienta" />
      </div>
      
      <div className="flex items-center">
        <PawPrint className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">{pet.name}</h1>
      </div>
    </div>
  );
};

export default PetHeader;
