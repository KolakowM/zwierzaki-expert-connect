
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, UserRound, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Specialization } from "@/hooks/useSpecializations";
import { AppRole } from "@/services/user/types";

export interface Specialist {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  location: string;
  image: string;
  email?: string;
  rating?: number;
  verified: boolean;
  role: AppRole;
  is_featured?: boolean;
}

interface SpecialistCardProps {
  specialist: Specialist;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug logging for featured status
  useEffect(() => {
    console.log('=== FEATURED BADGE DEBUG ===');
    console.log('Specialist:', specialist.name);
    console.log('is_featured value:', specialist.is_featured);
    console.log('is_featured type:', typeof specialist.is_featured);
    console.log('is_featured truthy:', !!specialist.is_featured);
    console.log('Specialist object:', specialist);
    console.log('============================');
  }, [specialist]);

  // Fetch specialization names for this specialist
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        
        if (!specialist.specializations || specialist.specializations.length === 0) {
          setSpecializations([]);
          setLoading(false);
          return;
        }
        
        console.log(`Fetching specializations for ${specialist.name}:`, specialist.specializations);
        
        // Fetch specialization details for the IDs we have
        const { data, error } = await supabase
          .from('specializations')
          .select('id, name, code, description')
          .in('id', specialist.specializations)
          .eq('active', 'yes');
          
        if (error) {
          console.error('Error fetching specializations for', specialist.name, error);
          setSpecializations([]);
        } else {
          console.log(`Found ${data?.length || 0} specializations for ${specialist.name}:`, data);
          setSpecializations(data || []);
        }
      } catch (err) {
        console.error('Error fetching specializations:', err);
        setSpecializations([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecializations();
  }, [specialist.specializations, specialist.name]);

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
              <svg 
                fill="#64748b" 
                viewBox="-5.6 -5.6 67.20 67.20" 
                xmlns="http://www.w3.org/2000/svg" 
                stroke="#64748b"
                className="h-32 w-32"
              >
                <path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 14.5 C 32.4765 14.5 36.0390 18.4375 36.0390 23.1719 C 36.0390 28.2109 32.4999 32.0547 27.9999 32.0078 C 23.4765 31.9609 19.9609 28.2109 19.9609 23.1719 C 19.9140 18.4375 23.4999 14.5 27.9999 14.5 Z M 42.2499 41.8750 L 42.3202 42.1797 C 38.7109 46.0234 33.3671 48.2266 27.9999 48.2266 C 22.6093 48.2266 17.2655 46.0234 13.6562 42.1797 L 13.7265 41.8750 C 15.7655 39.0625 20.7812 35.9922 27.9999 35.9922 C 35.1952 35.9922 40.2343 39.0625 42.2499 41.8750 Z"></path>
              </svg>
            </div>
          )}
          
          {/* Debug badge area - always show for debugging */}
          <div className="absolute right-2 top-2 z-10">
            {/* Debug info badge */}
            <div className="mb-1">
              <Badge 
                variant="outline" 
                className="text-xs bg-red-100 border-red-300 text-red-800"
              >
                DEBUG: {specialist.is_featured ? 'FEATURED' : 'NOT FEATURED'}
              </Badge>
            </div>
            
            {/* Actual featured badge */}
            {specialist.is_featured && (
              <Badge 
                className="bg-yellow-500 hover:bg-yellow-600 text-yellow-50 border-yellow-400 shadow-md"
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                Wyróżniony
              </Badge>
            )}
            
            {/* Fallback badge for debugging */}
            {!specialist.is_featured && (
              <Badge 
                variant="secondary" 
                className="text-xs opacity-50"
              >
                Regular
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-1 line-clamp-1 text-lg font-bold">{specialist.name}</CardTitle>
        <CardDescription className="mb-2 text-sm text-muted-foreground">
          {specialist.title}
        </CardDescription>
        
        {/* Additional debug info */}
        <div className="mb-2 text-xs text-muted-foreground">
          ID: {specialist.id} | Featured: {String(specialist.is_featured)}
        </div>
        
        {specialist.role === 'specialist' && (
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
        <Link to={`/specialist/${specialist.id}`} className="w-full">
          <Button className="w-full" variant="outline">
            Zobacz profil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
