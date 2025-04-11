
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mapSpecializationIdsToLabels } from "@/data/specializations";

interface SpecializationsListProps {
  specializations: string[];
}

export function SpecializationsList({ specializations }: SpecializationsListProps) {
  // Make sure we have an array of specializations to map
  const specializationsArray = Array.isArray(specializations) ? specializations : [];
  
  // Map IDs to labels for display
  const specializationLabels = mapSpecializationIdsToLabels(specializationsArray);

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-medium">Specjalizacje</h3>
        <div className="flex flex-wrap gap-2">
          {specializationLabels.length > 0 ? (
            specializationLabels.map((spec: string, index: number) => (
              <Badge key={index} variant="secondary">
                {spec}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">Brak specjalizacji</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
