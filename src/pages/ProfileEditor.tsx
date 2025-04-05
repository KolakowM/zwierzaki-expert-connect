
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCircle, Mail, Phone, MapPin, Award, Camera, FileText } from "lucide-react";

const profileFormSchema = z.object({
  title: z.string().min(2, "Tytuł musi mieć co najmniej 2 znaki"),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków"),
  specializations: z.array(z.string()).min(1, "Wybierz co najmniej jedną specjalizację"),
  services: z.array(z.string()).min(1, "Dodaj co najmniej jedną usługę"),
  education: z.array(z.string()),
  experience: z.string(),
  location: z.string().min(2, "Lokalizacja musi mieć co najmniej 2 znaki"),
  phoneNumber: z.string().min(9, "Podaj prawidłowy numer telefonu"),
  email: z.string().email("Wprowadź poprawny adres email"),
  website: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Available specializations
const availableSpecializations = [
  { id: "diet", label: "Dietetyka zwierzęca" },
  { id: "behavior", label: "Behawiorysta" },
  { id: "training", label: "Trener" },
  { id: "groomer", label: "Groomer" },
  { id: "vet", label: "Weterynarz" },
  { id: "physio", label: "Fizjoterapeuta" },
  { id: "alternative", label: "Medycyna alternatywna" },
];

export default function ProfileEditor() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([""]);
  const [education, setEducation] = useState<string[]>([""]);
  
  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      title: "",
      description: "",
      specializations: [],
      services: [],
      education: [],
      experience: "",
      location: "",
      phoneNumber: "",
      email: user?.email || "",
      website: "",
    },
  });

  // Handle file input change for profile photo
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new service input field
  const addService = () => {
    setServices([...services, ""]);
  };

  // Update a service at specific index
  const updateService = (index: number, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
    form.setValue("services", updatedServices.filter(service => service.trim() !== ""));
  };

  // Remove a service at specific index
  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
    form.setValue("services", updatedServices.filter(service => service.trim() !== ""));
  };

  // Add a new education input field
  const addEducation = () => {
    setEducation([...education, ""]);
  };

  // Update education at specific index
  const updateEducation = (index: number, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = value;
    setEducation(updatedEducation);
    form.setValue("education", updatedEducation.filter(item => item.trim() !== ""));
  };

  // Remove education at specific index
  const removeEducation = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
    form.setValue("education", updatedEducation.filter(item => item.trim() !== ""));
  };

  function onSubmit(values: ProfileFormValues) {
    // Filter out empty strings from services and education
    values.services = values.services.filter(service => service.trim() !== "");
    values.education = values.education.filter(edu => edu.trim() !== "");
    
    // Here you would typically save the profile data through an API
    console.log("Profile update values:", values);
    
    toast({
      title: "Profil zaktualizowany",
      description: "Twój profil został pomyślnie zaktualizowany.",
    });
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Edycja profilu specjalisty</h1>
          </div>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-600">Uzupełnij swój profil</CardTitle>
              <CardDescription>
                Aby być widocznym w katalogu specjalistów, uzupełnij wszystkie wymagane pola profilu.
                Im więcej informacji podasz, tym większa szansa, że klienci Cię znajdą.
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">
                <UserCircle className="mr-2 h-4 w-4" />
                Dane podstawowe
              </TabsTrigger>
              <TabsTrigger value="specializations">
                <Award className="mr-2 h-4 w-4" />
                Specjalizacje
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Phone className="mr-2 h-4 w-4" />
                Dane kontaktowe
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dane podstawowe</CardTitle>
                      <CardDescription>
                        Przedstaw się swoim potencjalnym klientom.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Profile photo */}
                      <div className="space-y-4">
                        <FormLabel>Zdjęcie profilowe</FormLabel>
                        <div className="flex items-center gap-6">
                          <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-muted bg-muted">
                            {photoPreview ? (
                              <img 
                                src={photoPreview} 
                                alt="Profile preview" 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Camera className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Input
                              id="photo"
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                              Zalecany format: JPG lub PNG. Maksymalny rozmiar: 5MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tytuł zawodowy</FormLabel>
                            <FormControl>
                              <Input placeholder="np. Dietetyk zwierzęcy, Behawiorysta psów" {...field} />
                            </FormControl>
                            <FormDescription>
                              Tytuł zawodowy, który będzie widoczny w twoim profilu
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opis</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Opisz swoją specjalizację, doświadczenie i podejście do pracy..." 
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Szczegółowy opis Twojej działalności, doświadczenia i metod pracy
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Experience */}
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Doświadczenie</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Opisz swoje doświadczenie zawodowe..." 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Opisz swoje doświadczenie zawodowe, np. lata praktyki, współpraca z klinikami
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Education */}
                      <div className="space-y-4">
                        <FormLabel>Wykształcenie i certyfikaty</FormLabel>
                        <FormDescription>
                          Dodaj informacje o swoim wykształceniu, ukończonych kursach i certyfikatach
                        </FormDescription>
                        
                        {education.map((edu, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="np. Uniwersytet Przyrodniczy - Zootechnika"
                              value={edu}
                              onChange={(e) => updateEducation(index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeEducation(index)}
                            >
                              Usuń
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addEducation}
                        >
                          Dodaj wykształcenie / certyfikat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="specializations">
                  <Card>
                    <CardHeader>
                      <CardTitle>Specjalizacje i usługi</CardTitle>
                      <CardDescription>
                        Wybierz swoje specjalizacje i opisz oferowane usługi
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Specializations */}
                      <FormField
                        control={form.control}
                        name="specializations"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">Specjalizacje</FormLabel>
                              <FormDescription>
                                Wybierz obszary, w których się specjalizujesz
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              {availableSpecializations.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="specializations"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item.id
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Services */}
                      <div className="space-y-4">
                        <FormLabel>Oferowane usługi</FormLabel>
                        <FormDescription>
                          Dodaj usługi, które oferujesz swoim klientom
                        </FormDescription>
                        
                        {services.map((service, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="np. Konsultacja dietetyczna, Szkolenie indywidualne"
                              value={service}
                              onChange={(e) => updateService(index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeService(index)}
                            >
                              Usuń
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addService}
                        >
                          Dodaj usługę
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contact">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dane kontaktowe</CardTitle>
                      <CardDescription>
                        Podaj dane kontaktowe, które będą widoczne dla potencjalnych klientów
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lokalizacja</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="np. Warszawa, Mokotów" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Miasto lub dzielnica, w której przyjmujesz klientów
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numer telefonu</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="np. 123456789" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Numer telefonu do kontaktu z klientami
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="email@example.com" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Adres email do kontaktu z klientami
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strona internetowa</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="np. www.twoja-strona.pl" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Twoja strona internetowa (opcjonalnie)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="ml-auto">
                        Zapisz profil
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
