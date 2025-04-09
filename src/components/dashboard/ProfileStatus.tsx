
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Mail, User, Camera } from "lucide-react";

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
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Dane podstawowe</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              {user?.firstName && user?.lastName ? 'Kompletne' : 'Częściowo'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Specjalizacje</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">Brak</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Zdjęcie</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">Brak</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Dane kontaktowe</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
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
