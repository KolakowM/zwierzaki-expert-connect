
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSpecialistSpecializations } from "@/hooks/useSpecializations";
import { Skeleton } from "@/components/ui/skeleton";

interface SpecializationsListProps {
  specialistId: string;
}

export function SpecializationsList({ specialistId }: SpecializationsListProps) {
  const { specializations, isLoading, error } = useSpecialistSpecializations(specialistId);

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-medium">Specjalizacje</h3>
        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-24 rounded-full" />
            ))
          ) : error ? (
            <p className="text-muted-foreground">Błąd ładowania specjalizacji</p>
          ) : specializations.length > 0 ? (
            specializations.map((spec) => (
              <Badge key={spec.id} variant="secondary">
                {spec.name}
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
