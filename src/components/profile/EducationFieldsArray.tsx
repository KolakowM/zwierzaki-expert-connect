
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDescription, FormLabel } from "@/components/ui/form";

interface EducationFieldsArrayProps {
  education: string[];
  updateEducation: (index: number, value: string) => void;
  removeEducation: (index: number) => void;
  addEducation: () => void;
}

export function EducationFieldsArray({
  education,
  updateEducation,
  removeEducation,
  addEducation,
}: EducationFieldsArrayProps) {
  return (
    <div className="space-y-4">
      <FormLabel>Wykształcenie i certyfikaty</FormLabel>
      <FormDescription>
        Dodaj informacje o swoim wykształceniu, ukończonych kursach i certyfikatach
      </FormDescription>
      
      {education.map((edu, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="np. Uniwersytet Przyrodniczy - Zootechnika"
            value={edu}
            onChange={(e) => updateEducation(index, e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => removeEducation(index)}
          >
            Usuń
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
      >
        Dodaj wykształcenie / certyfikat
      </Button>
    </div>
  );
}
