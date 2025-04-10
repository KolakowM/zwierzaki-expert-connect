
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SpecializationsListProps {
  specializations: string[];
}

export function SpecializationsList({ specializations }: SpecializationsListProps) {
  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-medium">Specjalizacje</h3>
        <div className="flex flex-wrap gap-2">
          {specializations && specializations.length > 0 ? (
            specializations.map((spec: string, index: number) => (
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
