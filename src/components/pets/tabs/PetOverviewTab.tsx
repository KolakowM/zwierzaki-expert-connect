
import { Pet } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface PetOverviewTabProps {
  pet: Pet;
}

const PetOverviewTab = ({ pet }: PetOverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-lg mb-4">Informacje podstawowe</h3>
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
            {pet.weight && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Waga:</span>
                <span className="font-medium">{pet.weight} kg</span>
              </div>
            )}
            {pet.sex && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Płeć:</span>
                <span className="font-medium">{pet.sex === 'male' ? 'Samiec' : 'Samica'}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sterylizacja:</span>
              <span className="font-medium">{pet.neutered ? 'Tak' : 'Nie'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {(pet.medicalHistory || pet.allergies || pet.dietaryRestrictions) && (
        <Card className="col-span-2">
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Historia zdrowia</h3>
            {pet.medicalHistory && (
              <div className="mb-4">
                <div className="text-muted-foreground mb-1">Historia medyczna:</div>
                <div className="whitespace-pre-wrap">{pet.medicalHistory}</div>
              </div>
            )}
            {pet.allergies && (
              <div className="mb-4">
                <div className="text-muted-foreground mb-1">Alergie:</div>
                <div className="whitespace-pre-wrap">{pet.allergies}</div>
              </div>
            )}
            {pet.dietaryRestrictions && (
              <div>
                <div className="text-muted-foreground mb-1">Ograniczenia żywieniowe:</div>
                <div className="whitespace-pre-wrap">{pet.dietaryRestrictions}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {pet.behavioralNotes && (
        <Card className="col-span-1 md:col-span-3">
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Notatki behawioralne</h3>
            <div className="whitespace-pre-wrap">{pet.behavioralNotes}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PetOverviewTab;
