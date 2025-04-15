
import { Pet } from "@/types";

interface PetOverviewTabProps {
  pet: Pet;
}

const PetOverviewTab = ({ pet }: PetOverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-medium mb-2">Podstawowe informacje</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gatunek:</span>
                <span className="font-medium">{pet.species}</span>
              </div>
              {pet.breed && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rasa:</span>
                  <span className="font-medium">{pet.breed}</span>
                </div>
              )}
              {pet.age && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wiek:</span>
                  <span className="font-medium">{pet.age} lat</span>
                </div>
              )}
              {pet.sex && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Płeć:</span>
                  <span className="font-medium">{pet.sex === 'male' ? 'Samiec' : 'Samica'}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kastracja/Sterylizacja:</span>
                <span className="font-medium">{pet.neutered ? 'Tak' : 'Nie'}</span>
              </div>
              {pet.weight && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waga:</span>
                  <span className="font-medium">{pet.weight} kg</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {(pet.medicalHistory || pet.allergies || pet.dietaryRestrictions) && (
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium mb-2">Informacje medyczne</h3>
              {pet.medicalHistory && (
                <div className="mb-3">
                  <div className="text-muted-foreground mb-1">Historia medyczna:</div>
                  <div>{pet.medicalHistory}</div>
                </div>
              )}
              {pet.allergies && (
                <div className="mb-3">
                  <div className="text-muted-foreground mb-1">Alergie:</div>
                  <div>{pet.allergies}</div>
                </div>
              )}
              {pet.dietaryRestrictions && (
                <div>
                  <div className="text-muted-foreground mb-1">Ograniczenia żywieniowe:</div>
                  <div>{pet.dietaryRestrictions}</div>
                </div>
              )}
            </div>
          )}
          
          {pet.behavioralNotes && (
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium mb-2">Zachowanie</h3>
              <div>{pet.behavioralNotes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetOverviewTab;
