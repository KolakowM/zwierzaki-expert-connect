
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProfileStatus = () => {
  const { user } = useAuth();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status profilu</CardTitle>
        <CardDescription>
          {user ? `Witaj, ${user.firstName || user.email}` : 'Uzupełnij swój profil, aby był widoczny w katalogu'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Dane podstawowe</span>
            <span className="text-xs text-amber-500 font-medium">
              {user?.firstName && user?.lastName ? 'Kompletne' : 'Częściowo'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Specjalizacje</span>
            <span className="text-xs text-red-500 font-medium">Brak</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Zdjęcie</span>
            <span className="text-xs text-red-500 font-medium">Brak</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Dane kontaktowe</span>
            <span className="text-xs text-green-500 font-medium">
              {user?.email ? 'Kompletne' : 'Brak'}
            </span>
          </div>
          <Link to="/settings">
            <Button size="sm" className="mt-2 w-full">
              Edytuj profil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatus;
