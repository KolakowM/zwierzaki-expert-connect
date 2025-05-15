
import { Button } from "@/components/ui/button";
import { SocialMediaLinks } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ContactInfoProps {
  specialist: {
    location: string;
    phoneNumber: string;
    email: string;
    website: string;
    socialMedia: SocialMediaLinks;
  };
  socialMediaIcons: Record<string, { icon: React.ReactNode; label: string }>;
}

export function ContactInfo({ specialist, socialMediaIcons }: ContactInfoProps) {
  const { toast } = useToast();

  const handleContactClick = () => {
    // Kopiowanie adresu email do schowka
    navigator.clipboard.writeText(specialist.email)
      .then(() => {
        toast({
          title: "Sukces",
          description: "Adres email został skopiowany do schowka",
        });
      })
      .catch((err) => {
        console.error("Nie udało się skopiować adresu email:", err);
        toast({
          title: "Błąd",
          description: "Nie udało się skopiować adresu email",
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 mt-0.5 text-primary"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{specialist.location}</span>
        </div>
        {specialist.phoneNumber && (
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 mt-0.5 text-primary"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <a href={`tel:${specialist.phoneNumber}`} className="hover:text-primary transition-colors">
              {specialist.phoneNumber}
            </a>
          </div>
        )}
        {specialist.email && (
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 mt-0.5 text-primary"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <a href={`mailto:${specialist.email}`} className="hover:text-primary transition-colors">
              {specialist.email}
            </a>
          </div>
        )}
        {specialist.website && (
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 mt-0.5 text-primary"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" x2="22" y1="12" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <a 
              href={specialist.website.startsWith('http') ? specialist.website : `https://${specialist.website}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors"
            >
              {specialist.website}
            </a>
          </div>
        )}
      </div>
      
      {/* Social Media Links */}
      {specialist.socialMedia && Object.keys(specialist.socialMedia).length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Media społecznościowe:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(specialist.socialMedia).map(([key, value]) => {
              if (!value) return null;
              const social = socialMediaIcons[key as keyof typeof socialMediaIcons];
              if (!social) return null;
              
              return (
                <a 
                  key={key}
                  href={value as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title={social.label}
                >
                  {social.icon}
                </a>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <Button className="w-full" onClick={handleContactClick}>
          Kopiuj adres email
        </Button>
      </div>
    </>
  );
}
