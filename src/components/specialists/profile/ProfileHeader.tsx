
import { Badge } from "@/components/ui/badge";

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
          <svg 
            fill="#64748b" 
            viewBox="-5.6 -5.6 67.20 67.20" 
            xmlns="http://www.w3.org/2000/svg"
            stroke="#64748b"
            className="h-40 w-40"
          >
            <path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 14.5 C 32.4765 14.5 36.0390 18.4375 36.0390 23.1719 C 36.0390 28.2109 32.4999 32.0547 27.9999 32.0078 C 23.4765 31.9609 19.9609 28.2109 19.9609 23.1719 C 19.9140 18.4375 23.4999 14.5 27.9999 14.5 Z M 42.2499 41.8750 L 42.3202 42.1797 C 38.7109 46.0234 33.3671 48.2266 27.9999 48.2266 C 22.6093 48.2266 17.2655 46.0234 13.6562 42.1797 L 13.7265 41.8750 C 15.7655 39.0625 20.7812 35.9922 27.9999 35.9922 C 35.1952 35.9922 40.2343 39.0625 42.2499 41.8750 Z"></path>
          </svg>
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
