
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useSpecializationsData } from "@/data/specializations";
import { Skeleton } from "@/components/ui/skeleton";
import { CatalogFilters } from "@/hooks/catalog/useCatalogQuery";

interface CatalogFilterProps {
  onFilterChange: (filters: CatalogFilters) => void;
  onReset: () => void;
  currentFilters: CatalogFilters;
}

export function CatalogFilter({ onFilterChange, onReset, currentFilters }: CatalogFilterProps) {
  const [location, setLocation] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const { specializations, isLoading, error } = useSpecializationsData();

  // Sync local state with current filters when they change externally
  useEffect(() => {
    setLocation(currentFilters.location || "");
    setSelectedSpecializations(currentFilters.specializations || []);
  }, [currentFilters]);

  const handleSpecializationChange = (id: string) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleApplyFilter = () => {
    onFilterChange({
      location: location || undefined,
      specializations: selectedSpecializations.length > 0 ? selectedSpecializations : undefined
    });
  };

  const handleReset = () => {
    setLocation("");
    setSelectedSpecializations([]);
    onReset();
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
              {isLoading ? (
                // Show loading skeletons while data is being fetched
                Array.from({ length: 5 }).map((_, index) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))
              ) : error ? (
                <p className="text-sm text-destructive">Error loading specializations</p>
              ) : (
                specializations
                  .slice() // Create a shallow copy
                  .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
                  .map((specialization) => (
                    <div className="flex items-center space-x-2" key={specialization.id}>
                      <Checkbox 
                        id={specialization.id} 
                        checked={selectedSpecializations.includes(specialization.id)}
                        onCheckedChange={() => handleSpecializationChange(specialization.id)}
                      />
                      <label
                        htmlFor={specialization.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {specialization.name}
                      </label>
                    </div>
                  ))
              )}
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
