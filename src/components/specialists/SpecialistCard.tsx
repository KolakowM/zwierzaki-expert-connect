
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import { mapSpecializationIdsToLabels } from "@/data/specializations";

export interface Specialist {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  location: string;
  image: string;
  rating?: number;
  verified: boolean;
}

interface SpecialistCardProps {
  specialist: Specialist;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  // Mapujemy ID specjalizacji na etykiety do wyświetlenia
  const specializationLabels = mapSpecializationIdsToLabels(specialist.specializations);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          {specialist.image && !specialist.image.includes('placeholder.svg') ? (
            <img
              src={specialist.image}
              alt={specialist.name}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {specialist.verified && (
            <div className="absolute right-2 top-2">
              <Badge className="bg-primary/90 hover:bg-primary">Zweryfikowany</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-1 line-clamp-1 text-lg font-bold">{specialist.name}</CardTitle>
        <CardDescription className="mb-2 text-sm text-muted-foreground">
          {specialist.title}
        </CardDescription>
        <div className="mb-3 flex flex-wrap gap-1">
          {specializationLabels.length > 0 ? (
            <>
              {specializationLabels.slice(0, 3).map((spec) => (
                <Badge key={spec} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {specializationLabels.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{specializationLabels.length - 3}
                </Badge>
              )}
            </>
          ) : (
            <Badge variant="outline" className="text-xs">Brak specjalizacji</Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {specialist.location}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/specialist/${specialist.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            Zobacz profil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
