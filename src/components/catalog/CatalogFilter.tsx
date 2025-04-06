
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface CatalogFilterProps {
  onFilterChange: (filters: any) => void;
}

export function CatalogFilter({ onFilterChange }: CatalogFilterProps) {
  const [location, setLocation] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);

  const specializationOptions = [
    { id: "dietetyk", label: "Dietetyk zwierzęcy" },
    { id: "behawiorysta", label: "Behawiorysta" },
    { id: "fizjoterapeuta", label: "Fizjoterapeuta" },
    { id: "trener", label: "Trener" },
    { id: "groomer", label: "Groomer" },
    { id: "weterynarz", label: "Weterynarz" },
    { id: "psycholog", label: "Psycholog" },
    { id: "hodowca", label: "Hodowca" },
  ];

  const handleSpecializationChange = (id: string) => {
    setSpecializations(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleApplyFilter = () => {
    onFilterChange({
      location,
      specializations
    });
  };

  const handleReset = () => {
    setLocation("");
    setSpecializations([]);
    onFilterChange({});
  };

  return (
    <div className="space-y-6 rounded-lg border p-4">
      <div>
        <h3 className="mb-4 font-medium">Filtruj według</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Lokalizacja</Label>
            <Input
              id="location"
              placeholder="Miasto lub region"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <Label>Specjalizacje</Label>
            <div className="space-y-2">
              {specializationOptions.map((specialization) => (
                <div className="flex items-center space-x-2" key={specialization.id}>
                  <Checkbox 
                    id={specialization.id} 
                    checked={specializations.includes(specialization.id)}
                    onCheckedChange={() => handleSpecializationChange(specialization.id)}
                  />
                  <label
                    htmlFor={specialization.id}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {specialization.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button onClick={handleApplyFilter}>Zastosuj filtry</Button>
        <Button variant="outline" onClick={handleReset}>Resetuj filtry</Button>
      </div>
    </div>
  );
}
