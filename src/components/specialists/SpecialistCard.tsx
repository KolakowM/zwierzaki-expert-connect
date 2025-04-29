
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Camera, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Specialization } from "@/hooks/useSpecializations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppRole } from "@/services/userService";

export interface Specialist {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  location: string;
  image: string;
  rating?: number;
  verified: boolean;
  role?: AppRole;
}

interface SpecialistCardProps {
  specialist: Specialist;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const isSpecialist = specialist.role === 'specialist';
  const isAdmin = specialist.role === 'admin';

  // Fetch specialization names for specialists
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        
        if (!isSpecialist || !specialist.specializations || specialist.specializations.length === 0) {
          setSpecializations([]);
          return;
        }
        
        // Fetch specialization details for the IDs we have
        const { data, error } = await supabase
          .from('specializations')
          .select('*')
          .in('id', specialist.specializations);
          
        if (error) throw error;
        
        setSpecializations(data || []);
      } catch (err) {
        console.error('Error fetching specializations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecializations();
  }, [specialist.specializations, isSpecialist]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          {isSpecialist ? (
            specialist.image && !specialist.image.includes('placeholder.svg') ? (
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
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Avatar className="h-24 w-24">
                <AvatarImage src={specialist.image} alt={specialist.name} />
                <AvatarFallback>{getInitials(specialist.name)}</AvatarFallback>
              </Avatar>
            </div>
          )}
          
          {specialist.verified && (
            <div className="absolute right-2 top-2">
              <Badge className="bg-primary/90 hover:bg-primary">Zweryfikowany</Badge>
            </div>
          )}
          
          {isAdmin && (
            <div className="absolute left-2 top-2">
              <Badge variant="destructive">Administrator</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-1 line-clamp-1 text-lg font-bold">{specialist.name}</CardTitle>
        <CardDescription className="mb-2 text-sm text-muted-foreground">
          {specialist.title}
        </CardDescription>
        
        {isSpecialist && (
          <div className="mb-3 flex flex-wrap gap-1">
            {loading ? (
              <Badge variant="outline" className="text-xs">Ładowanie...</Badge>
            ) : specializations.length > 0 ? (
              <>
                {specializations.slice(0, 3).map((spec) => (
                  <Badge key={spec.id} variant="secondary" className="text-xs">
                    {spec.name}
                  </Badge>
                ))}
                {specializations.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{specializations.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant="outline" className="text-xs">Brak specjalizacji</Badge>
            )}
          </div>
        )}
        
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
        <Link to={isSpecialist ? `/specialist/${specialist.id}` : `/user/${specialist.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            Zobacz profil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
