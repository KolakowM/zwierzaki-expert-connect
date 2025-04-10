
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  specialist: {
    name: string;
    title: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    image: string | null;
  };
}

export function ProfileHeader({ specialist }: ProfileHeaderProps) {
  return (
    <div className="aspect-square w-full">
      {specialist.image ? (
        <img
          src={specialist.image}
          alt={specialist.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-muted">
          <Camera className="h-20 w-20 text-muted-foreground" />
        </div>
      )}
      <div className="p-6">
        <h1 className="mb-2 text-2xl font-bold">{specialist.name}</h1>
        <p className="mb-4 text-muted-foreground">{specialist.title}</p>
        
        <div className="mb-4 flex items-center">
          {specialist.verified && (
            <Badge className="mr-2 bg-primary">Zweryfikowany</Badge>
          )}
          <div className="flex items-center text-amber-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="mr-1 font-medium">{specialist.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({specialist.reviewCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
