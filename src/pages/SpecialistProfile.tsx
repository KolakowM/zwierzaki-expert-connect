
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon, TwitchIcon, TikTokIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SpecialistProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [specialist, setSpecialist] = useState<any>(null);

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('specialist_profiles')
          .select('*')
          
        if (id) {
          query = query.eq('id', id);
        } else {
          // For demo purposes - fetch first specialist if no ID provided
          query = query.limit(1);
        }
          
        const { data, error } = await query.maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setSpecialist({
            id: data.id,
            name: "Anna Kowalska", // Replace with actual name from user_profiles join
            title: data.title || "Dietetyk zwierzęcy",
            specializations: data.specializations || ["Dietetyka psów i kotów", "Żywienie psów", "Alergie pokarmowe", "BARF", "Diety eliminacyjne"],
            description: data.description || "Dyplomowany dietetyk zwierzęcy z ponad 10-letnim doświadczeniem...",
            services: data.services || [
              "Konsultacje dietetyczne",
              "Plany żywieniowe dostosowane do indywidualnych potrzeb",
              "Diety eliminacyjne dla zwierząt z alergiami",
              "Żywienie w chorobach przewlekłych",
              "Dieta BARF i naturalne żywienie"
            ],
            education: data.education || [
              "Uniwersytet Przyrodniczy we Wrocławiu - Zootechnika, specjalizacja: żywienie zwierząt",
              "Certyfikat Dietetyka Zwierzęcego - Animal Nutrition Academy",
              "Kurs Terapii Żywieniowej w Chorobach Metabolicznych"
            ],
            experience: data.experience || "10+ lat doświadczenia w dietetyce zwierzęcej...",
            location: data.location || "Warszawa, Mokotów",
            phoneNumber: data.phone_number || "+48 123 456 789",
            email: "anna.kowalska@example.com", // Replace with actual email from user_profiles join
            website: data.website || "www.annakdietetyk.pl",
            socialMedia: data.social_media || {},
            image: data.photo_url || "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=2376&auto=format&fit=crop",
            rating: 4.9,
            reviewCount: 126,
            verified: true,
          });
        } else {
          // Fallback to sample data for demo
          setSpecialist({
            id: "1",
            name: "Anna Kowalska",
            title: "Dietetyk zwierzęcy",
            specializations: ["Dietetyka psów i kotów", "Żywienie psów", "Alergie pokarmowe", "BARF", "Diety eliminacyjne"],
            description: "Dyplomowany dietetyk zwierzęcy z ponad 10-letnim doświadczeniem. Specjalizuję się w tworzeniu indywidualnych planów żywieniowych dla psów i kotów z alergiami pokarmowymi oraz problemami zdrowotnymi. Absolwentka Uniwersytetu Przyrodniczego we Wrocławiu oraz licznych kursów i szkoleń z zakresu żywienia zwierząt towarzyszących.",
            services: [
              "Konsultacje dietetyczne",
              "Plany żywieniowe dostosowane do indywidualnych potrzeb",
              "Diety eliminacyjne dla zwierząt z alergiami",
              "Żywienie w chorobach przewlekłych",
              "Dieta BARF i naturalne żywienie"
            ],
            education: [
              "Uniwersytet Przyrodniczy we Wrocławiu - Zootechnika, specjalizacja: żywienie zwierząt",
              "Certyfikat Dietetyka Zwierzęcego - Animal Nutrition Academy",
              "Kurs Terapii Żywieniowej w Chorobach Metabolicznych"
            ],
            experience: "10+ lat doświadczenia w dietetyce zwierzęcej. Współpraca z klinikami weterynaryjnymi na terenie Warszawy. Autorka licznych artykułów z zakresu żywienia zwierząt towarzyszących.",
            location: "Warszawa, Mokotów",
            phoneNumber: "+48 123 456 789",
            email: "anna.kowalska@example.com",
            website: "www.annakdietetyk.pl",
            socialMedia: {
              facebook: "https://facebook.com/annadietetyk",
              instagram: "https://instagram.com/annadietetyk",
              twitter: "https://twitter.com/annadietetyk"
            },
            image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=2376&auto=format&fit=crop",
            rating: 4.9,
            reviewCount: 126,
            verified: true,
          });
        }
      } catch (error) {
        console.error("Error fetching specialist profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecialist();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!specialist) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Specjalista nie został znaleziony</h1>
            <p className="text-muted-foreground">
              Nie mogliśmy znaleźć specjalisty o podanym identyfikatorze.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Social media icon components mapping
  const socialMediaIcons = {
    facebook: { icon: <FacebookIcon className="h-5 w-5 text-blue-600" />, label: "Facebook" },
    instagram: { icon: <InstagramIcon className="h-5 w-5 text-pink-600" />, label: "Instagram" },
    twitter: { icon: <TwitterIcon className="h-5 w-5 text-blue-400" />, label: "Twitter" },
    linkedin: { icon: <LinkedinIcon className="h-5 w-5 text-blue-700" />, label: "LinkedIn" },
    youtube: { icon: <YoutubeIcon className="h-5 w-5 text-red-600" />, label: "YouTube" },
    tiktok: { icon: <TikTokIcon className="h-5 w-5" />, label: "TikTok" },
    twitch: { icon: <TwitchIcon className="h-5 w-5 text-purple-600" />, label: "Twitch" }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column - Profile info */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square w-full">
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="h-full w-full object-cover"
                  />
                </div>
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
                      <span>{specialist.phoneNumber}</span>
                    </div>
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
                      <span>{specialist.email}</span>
                    </div>
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
                        <span>{specialist.website}</span>
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
                    <Button className="w-full">Kontakt</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Specializations */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">Specjalizacje</h3>
                <div className="flex flex-wrap gap-2">
                  {specialist.specializations.map((spec: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Tabs with detailed info */}
          <div className="md:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="about" className="flex-1">O mnie</TabsTrigger>
                <TabsTrigger value="services" className="flex-1">Usługi</TabsTrigger>
                <TabsTrigger value="qualifications" className="flex-1">Kwalifikacje</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">O mnie</h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {specialist.description}
                    </p>
                    
                    <h3 className="text-xl font-bold mt-8 mb-3">Doświadczenie</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {specialist.experience}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Oferowane usługi</h2>
                    <ul className="space-y-4">
                      {specialist.services.map((service: string, index: number) => (
                        <li key={index} className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3 h-6 w-6 text-primary"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          <div>
                            <p className="font-medium">{service}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="qualifications" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Wykształcenie i certyfikaty</h2>
                    <ul className="space-y-4">
                      {specialist.education.map((edu: string, index: number) => (
                        <li key={index} className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-3 h-6 w-6 text-primary"
                          >
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                          </svg>
                          <div>
                            <p className="font-medium">{edu}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpecialistProfile;
