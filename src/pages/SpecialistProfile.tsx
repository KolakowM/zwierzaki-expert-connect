
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample specialist data
const specialistData = {
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
  image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=2376&auto=format&fit=crop",
  rating: 4.9,
  reviewCount: 126,
  verified: true,
};

const SpecialistProfile = () => {
  const { id } = useParams();

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
                    src={specialistData.image}
                    alt={specialistData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h1 className="mb-2 text-2xl font-bold">{specialistData.name}</h1>
                  <p className="mb-4 text-muted-foreground">{specialistData.title}</p>
                  
                  <div className="mb-4 flex items-center">
                    {specialistData.verified && (
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
                      <span className="mr-1 font-medium">{specialistData.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({specialistData.reviewCount})
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
                      <span>{specialistData.location}</span>
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
                      <span>{specialistData.phoneNumber}</span>
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
                      <span>{specialistData.email}</span>
                    </div>
                    {specialistData.website && (
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
                        <span>{specialistData.website}</span>
                      </div>
                    )}
                  </div>
                  
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
                  {specialistData.specializations.map((spec, index) => (
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
                    <h2 className="mb-4 text-2xl font-bold">O specjaliście</h2>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {specialistData.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-6 text-2xl font-bold">Świadczone usługi</h2>
                    <ul className="list-inside list-disc space-y-2">
                      {specialistData.services.map((service, index) => (
                        <li key={index} className="text-muted-foreground">
                          {service}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="qualifications" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-6 text-2xl font-bold">Wykształcenie i doświadczenie</h2>
                    
                    <h3 className="mb-3 text-lg font-medium">Wykształcenie</h3>
                    <ul className="mb-6 list-inside list-disc space-y-2">
                      {specialistData.education.map((edu, index) => (
                        <li key={index} className="text-muted-foreground">
                          {edu}
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="mb-3 text-lg font-medium">Doświadczenie</h3>
                    <p className="text-muted-foreground">{specialistData.experience}</p>
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
