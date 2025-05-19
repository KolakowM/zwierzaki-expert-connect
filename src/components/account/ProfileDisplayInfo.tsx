
import { Info, MapPin, Phone, Mail } from "lucide-react";

interface ProfileDisplayInfoProps {
  label: string;
  value: string | undefined;
  icon: React.ReactNode;
}

export function ProfileDisplayInfo({ label, value, icon }: ProfileDisplayInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        {icon}
        <div className="text-sm font-medium">{label}</div>
      </div>
      <div className="flex items-center justify-between rounded-md border p-3 bg-muted/50">
        <div className="text-sm">
          {value || `Nie podano ${label.toLowerCase()}`}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          Można edytować w zakładce "Profil specjalisty"
        </div>
      </div>
    </div>
  );
}

export function PhoneDisplayInfo({ value }: { value: string | undefined }) {
  return (
    <ProfileDisplayInfo 
      label="Telefon" 
      value={value} 
      icon={<Phone className="mr-2 h-4 w-4 text-muted-foreground" />} 
    />
  );
}

export function LocationDisplayInfo({ value }: { value: string | undefined }) {
  return (
    <ProfileDisplayInfo 
      label="Miasto" 
      value={value} 
      icon={<MapPin className="mr-2 h-4 w-4 text-muted-foreground" />} 
    />
  );
}

export function EmailDisplayInfo({ value }: { value: string | undefined }) {
  return (
    <ProfileDisplayInfo 
      label="Email kontaktowy" 
      value={value} 
      icon={<Mail className="mr-2 h-4 w-4 text-muted-foreground" />} 
    />
  );
}
