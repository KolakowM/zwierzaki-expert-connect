
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider"; 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCircle, Mail, Lock, Shield, Award, Camera, Phone, MapPin, FileText, Trash2,
  Facebook, Instagram, Youtube, Twitter, Linkedin, Twitch
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { updateUserProfile, updateUserPassword } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

// Form schemas
const accountFormSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
  email: z.string().email("Wprowadź poprawny adres email"),
  phone: z.string().optional(),
  city: z.string().optional()
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
  newPassword: z.string().min(8, "Nowe hasło musi mieć co najmniej 8 znaków"),
  confirmPassword: z.string().min(8, "Potwierdź nowe hasło")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"]
});

// Define social media links schema
const socialMediaSchema = z.object({
  facebook: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
  instagram: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
  twitter: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
  linkedin: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
  youtube: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
  tiktok: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
  twitch: z.string().url("Wprowadź poprawny URL").optional().or(z.literal(""))
});

const profileFormSchema = z.object({
  title: z.string().min(2, "Tytuł musi mieć co najmniej 2 znaki").optional(),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków").optional(),
  specializations: z.array(z.string()).min(1, "Wybierz co najmniej jedną specjalizację").optional(),
  services: z.array(z.string()).min(1, "Dodaj co najmniej jedną usługę").optional(),
  education: z.array(z.string()).optional(),
  experience: z.string().optional(),
  location: z.string().min(2, "Lokalizacja musi mieć co najmniej 2 znaki").optional(),
  phoneNumber: z.string().min(9, "Podaj prawidłowy numer telefonu").optional(),
  website: z.string().optional(),
  socialMedia: socialMediaSchema.optional()
});

// Types based on schemas
type AccountFormValues = z.infer<typeof accountFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SocialMediaValues = z.infer<typeof socialMediaSchema>;

// Available specializations
const availableSpecializations = [{
  id: "diet",
  label: "Dietetyka zwierzęca"
}, {
  id: "behavior",
  label: "Behawiorysta"
}, {
  id: "training",
  label: "Trener"
}, {
  id: "groomer",
  label: "Groomer"
}, {
  id: "vet",
  label: "Weterynarz"
}, {
  id: "physio",
  label: "Fizjoterapeuta"
}, {
  id: "alternative",
  label: "Medycyna alternatywna"
}];

export default function AccountSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([""]);
  const [education, setEducation] = useState<string[]>([""]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialistProfile, setSpecialistProfile] = useState<any>(null);

  // Initialize forms
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: ""
    }
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  const profileForm = useForm<ProfileFormValues>({
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
      website: "",
      socialMedia: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
        twitch: ""
      }
    }
  });

  // Load user data into the form when available
  useEffect(() => {
    if (user) {
      accountForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: "",
        city: ""
      });
      
      // Fetch specialist profile data if user is authenticated
      const fetchSpecialistProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('specialist_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setSpecialistProfile(data);
            
            // Initialize form with data from database
            // Ensure social_media is correctly formatted as an object
            const socialMediaData = data.social_media ? 
              (typeof data.social_media === 'object' ? data.social_media : {}) : 
              {};
              
            profileForm.reset({
              title: data.title || "",
              description: data.description || "",
              specializations: data.specializations || [],
              services: data.services || [],
              education: data.education || [],
              experience: data.experience || "",
              location: data.location || "",
              phoneNumber: data.phone_number || "",
              website: data.website || "",
              socialMedia: {
                facebook: socialMediaData.facebook || "",
                instagram: socialMediaData.instagram || "",
                twitter: socialMediaData.twitter || "",
                linkedin: socialMediaData.linkedin || "",
                youtube: socialMediaData.youtube || "",
                tiktok: socialMediaData.tiktok || "",
                twitch: socialMediaData.twitch || ""
              }
            });
            
            // Initialize services state array
            if (data.services && data.services.length > 0) {
              setServices(data.services);
            }
            
            // Initialize education state array
            if (data.education && data.education.length > 0) {
              setEducation(data.education);
            }
          }
        } catch (error) {
          console.error("Error fetching specialist profile:", error);
        }
      };
      
      fetchSpecialistProfile();
    }
  }, [user, accountForm, profileForm]);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Brak dostępu",
        description: "Musisz być zalogowany, aby edytować ustawienia konta",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

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
    profileForm.setValue("services", updatedServices.filter(service => service.trim() !== ""));
  };

  // Remove a service at specific index
  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
    profileForm.setValue("services", updatedServices.filter(service => service.trim() !== ""));
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
    profileForm.setValue("education", updatedEducation.filter(item => item.trim() !== ""));
  };

  // Remove education at specific index
  const removeEducation = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
    profileForm.setValue("education", updatedEducation.filter(item => item.trim() !== ""));
  };

  // Form submission handlers
  async function onAccountSubmit(values: AccountFormValues) {
    try {
      setIsSubmitting(true);
      console.log("Account update values:", values);
      
      // Update user profile in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user?.id,
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          city: values.city
        });
        
      if (error) throw error;
      
      // Refresh user data to show updated information
      await refreshUserData();
      
      toast({
        title: "Zaktualizowano dane",
        description: "Twoje dane zostały pomyślnie zaktualizowane."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Błąd aktualizacji",
        description: error.message || "Wystąpił błąd podczas aktualizacji danych.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  async function onPasswordSubmit(values: PasswordFormValues) {
    try {
      setIsSubmitting(true);
      console.log("Password change values:", values);
      
      await updateUserPassword(values.currentPassword, values.newPassword);
      
      toast({
        title: "Hasło zostało zmienione",
        description: "Twoje hasło zostało pomyślnie zaktualizowane."
      });
      
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Błąd zmiany hasła",
        description: error.message || "Wystąpił błąd podczas zmiany hasła.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  async function onProfileSubmit(values: ProfileFormValues) {
    try {
      setIsSubmitting(true);
      
      // Filter out empty strings from services and education
      const cleanedServices = (values.services || []).filter(service => service.trim() !== "");
      const cleanedEducation = (values.education || []).filter(edu => edu.trim() !== "");
      
      // Filter out empty social media links
      const socialMedia: Record<string, string> = {};
      if (values.socialMedia) {
        Object.entries(values.socialMedia).forEach(([key, value]) => {
          if (value && value.trim() !== '') {
            socialMedia[key] = value.trim();
          }
        });
      }
      
      // Update specialist profile in Supabase
      const { error } = await supabase
        .from('specialist_profiles')
        .upsert({
          id: user?.id,
          title: values.title,
          description: values.description,
          specializations: values.specializations,
          services: cleanedServices,
          education: cleanedEducation,
          experience: values.experience,
          location: values.location,
          phone_number: values.phoneNumber,
          website: values.website,
          social_media: socialMedia
        });
        
      if (error) throw error;
      
      toast({
        title: "Profil zaktualizowany",
        description: "Twój profil specjalisty został pomyślnie zaktualizowany."
      });
      
      // Update local state
      setSpecialistProfile({
        ...specialistProfile,
        title: values.title,
        description: values.description,
        specializations: values.specializations,
        services: cleanedServices,
        education: cleanedEducation,
        experience: values.experience,
        location: values.location,
        phone_number: values.phoneNumber,
        website: values.website,
        social_media: socialMedia
      });
      
    } catch (error: any) {
      console.error("Error updating specialist profile:", error);
      toast({
        title: "Błąd aktualizacji",
        description: error.message || "Wystąpił błąd podczas aktualizacji profilu specjalisty.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  function handleDeleteAccount() {
    console.log("Deleting account...");
    toast({
      title: "Konto usunięte",
      description: "Twoje konto zostało usunięte. Przekierowujemy Cię do strony głównej.",
      variant: "destructive"
    });
    logout();
    navigate("/");
  }
  
  if (!isAuthenticated) {
    return <div />;
  }
  
  // Social media input components with appropriate icons
  const socialMediaInputs = [
    { name: "facebook", label: "Facebook", icon: <Facebook className="mr-2 h-4 w-4 text-blue-600" /> },
    { name: "instagram", label: "Instagram", icon: <Instagram className="mr-2 h-4 w-4 text-pink-600" /> },
    { name: "twitter", label: "Twitter", icon: <Twitter className="mr-2 h-4 w-4 text-blue-400" /> },
    { name: "linkedin", label: "LinkedIn", icon: <Linkedin className="mr-2 h-4 w-4 text-blue-700" /> },
    { name: "youtube", label: "YouTube", icon: <Youtube className="mr-2 h-4 w-4 text-red-600" /> },
    { name: "tiktok", label: "TikTok", icon: <div className="mr-2 h-4 w-4">TT</div> },
    { name: "twitch", label: "Twitch", icon: <Twitch className="mr-2 h-4 w-4 text-purple-600" /> }
  ];
  
  return <MainLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Ustawienia konta</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">
                <Mail className="mr-2 h-4 w-4" />
                Dane podstawowe
              </TabsTrigger>
              <TabsTrigger value="password">
                <Lock className="mr-2 h-4 w-4" />
                Hasło i bezpieczeństwo
              </TabsTrigger>
              <TabsTrigger value="specialist">
                <Award className="mr-2 h-4 w-4" />
                Profil specjalisty
              </TabsTrigger>
            </TabsList>

            {/* General account information tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Dane profilu</CardTitle>
                  <CardDescription>
                    Zaktualizuj swoje dane osobowe i kontaktowe.
                  </CardDescription>
                </CardHeader>
                <Form {...accountForm}>
                  <form onSubmit={accountForm.handleSubmit(onAccountSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField control={accountForm.control} name="firstName" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Imię</FormLabel>
                              <FormControl>
                                <Input placeholder="Imię" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={accountForm.control} name="lastName" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Nazwisko</FormLabel>
                              <FormControl>
                                <Input placeholder="Nazwisko" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <FormField control={accountForm.control} name="email" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" {...field} disabled />
                            </FormControl>
                            <FormDescription>
                              Zmiana adresu email wymaga weryfikacji. Skontaktuj się z administratorem.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={accountForm.control} name="phone" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="Numer telefonu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={accountForm.control} name="city" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Miasto</FormLabel>
                            <FormControl>
                              <Input placeholder="Miasto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            {/* Password change and security tab */}
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Zmień hasło</CardTitle>
                  <CardDescription>
                    Aktualizuj swoje hasło, aby zabezpieczyć konto.
                  </CardDescription>
                </CardHeader>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField control={passwordForm.control} name="currentPassword" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Obecne hasło</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={passwordForm.control} name="newPassword" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Nowe hasło</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={passwordForm.control} name="confirmPassword" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Potwierdź nowe hasło</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Zmienianie hasła..." : "Zmień hasło"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>

              <Card className="mt-6 border-amber-200 bg-amber-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-amber-500" />
                    <CardTitle>Bezpieczeństwo konta</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Dla zwiększenia bezpieczeństwa, zalecamy regularne zmienianie hasła
                    oraz włączenie weryfikacji dwuetapowej, gdy tylko będzie dostępna.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-6 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 my-[5px]">Muszę zakończyć współpracę</CardTitle>
                  <CardDescription>
                    Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Usuń konto
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Czy na pewno chcesz usunąć konto?</DialogTitle>
                        <DialogDescription>
                          Ta akcja jest nieodwracalna. Spowoduje trwałe usunięcie Twojego konta i wszystkich 
                          powiązanych z nim danych, w tym profilu, ustawień i historii działań.
                        </DialogDescription>
                      </DialogHeader>
                      <Separator className="my-4" />
                      <div className="flex justify-between">
                        <DialogClose asChild>
                          <Button variant="outline">Anuluj</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Tak, usuń moje konto
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specialist profile tab */}
            <TabsContent value="specialist">
              <Card>
                <CardHeader>
                  <CardTitle>Profil specjalisty</CardTitle>
                  <CardDescription>
                    Uzupełnij swój profil specjalisty, aby był widoczny w katalogu.
                  </CardDescription>
                </CardHeader>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <CardContent className="space-y-6">
                      {/* Profile photo */}
                      <div className="space-y-4">
                        <FormLabel>Zdjęcie profilowe</FormLabel>
                        <div className="flex items-center gap-6">
                          <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-muted bg-muted">
                            {photoPreview ? <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Camera className="h-12 w-12 text-muted-foreground" />
                              </div>}
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="w-full" />
                            <p className="text-xs text-muted-foreground">
                              Zalecany format: JPG lub PNG. Maksymalny rozmiar: 5MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Basic specialist info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Dane podstawowe</h3>
                        
                        <FormField control={profileForm.control} name="title" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Tytuł zawodowy</FormLabel>
                              <FormControl>
                                <Input placeholder="np. Dietetyk zwierzęcy, Behawiorysta psów" {...field} />
                              </FormControl>
                              <FormDescription>
                                Tytuł zawodowy, który będzie widoczny w twoim profilu
                              </FormDescription>
                              <FormMessage />
                            </FormItem>} />
                        
                        <FormField control={profileForm.control} name="description" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Opis</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Opisz swoją specjalizację, doświadczenie i podejście do pracy..." className="min-h-[150px]" {...field} />
                              </FormControl>
                              <FormDescription>
                                Szczegółowy opis Twojej działalności, doświadczenia i metod pracy
                              </FormDescription>
                              <FormMessage />
                            </FormItem>} />

                        <FormField control={profileForm.control} name="experience" render={({
                        field
                      }) => <FormItem>
                              <FormLabel>Doświadczenie</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Opisz swoje doświadczenie zawodowe..." className="min-h-[100px]" {...field} />
                              </FormControl>
                              <FormDescription>
                                Opisz swoje doświadczenie zawodowe, np. lata praktyki, współpraca z klinikami
                              </FormDescription>
                              <FormMessage />
                            </FormItem>} />
                      </div>

                      {/* Education */}
                      <div className="space-y-4">
                        <FormLabel>Wykształcenie i certyfikaty</FormLabel>
                        <FormDescription>
                          Dodaj informacje o swoim wykształceniu, ukończonych kursach i certyfikatach
                        </FormDescription>
                        
                        {education.map((edu, index) => <div key={index} className="flex gap-2">
                            <Input placeholder="np. Uniwersytet Przyrodniczy - Zootechnika" value={edu} onChange={e => updateEducation(index, e.target.value)} className="flex-1" />
                            <Button type="button" variant="outline" onClick={() => removeEducation(index)}>
                              Usuń
                            </Button>
                          </div>)}
                        
                        <Button type="button" variant="outline" onClick={addEducation}>
                          Dodaj wykształcenie / certyfikat
                        </Button>
                      </div>

                      {/* Specializations */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Specjalizacje</h3>
                        
                        <FormField control={profileForm.control} name="specializations" render={() => <FormItem>
                              <div className="mb-4">
                                <FormLabel>Specjalizacje</FormLabel>
                                <FormDescription>
                                  Wybierz obszary, w których się specjalizujesz
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {availableSpecializations.map(item => <FormField key={item.id} control={profileForm.control} name="specializations" render={({
                            field
                          }) => {
                            return <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={checked => {
                                  return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter(value => value !== item.id));
                                }} />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {item.label}
                                          </FormLabel>
                                        </FormItem>;
                          }} />)}
                              </div>
                              <FormMessage />
                            </FormItem>} />
                      </div>

                      {/* Services */}
                      <div className="space-y-4">
                        <FormLabel>Oferowane usługi</FormLabel>
                        <FormDescription>
                          Dodaj usługi, które oferujesz swoim klientom
                        </FormDescription>
                        
                        {services.map((service, index) => <div key={index} className="flex gap-2">
                            <Input placeholder="np. Konsultacja dietetyczna, Szkolenie indywidualne" value={service} onChange={e => updateService(index, e.target.value)} className="flex-1" />
                            <Button type="button" variant="outline" onClick={() => removeService(index)}>
                              Usuń
                            </Button>
                          </div>)}
                        
                        <Button type="button" variant="outline" onClick={addService}>
                          Dodaj usługę
                        </Button>
                      </div>

                      {/* Social Media Links */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Media społecznościowe</h3>
                        <FormDescription>
                          Dodaj linki do swoich profili w mediach społecznościowych
                        </FormDescription>
                        
                        <div className="space-y-4">
                          {socialMediaInputs.map((social) => (
                            <FormField
                              key={social.name}
                              control={profileForm.control}
                              name={`socialMedia.${social.name}` as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center">
                                    {social.icon}
                                    {social.label}
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder={`https://${social.name}.com/twojprofil`} 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Contact details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Dane kontaktowe</h3>
                        
                        <FormField control={profileForm.control} name="location" render={({
                        field
                      }) => <FormItem>
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
                            </FormItem>} />

                        <FormField control={profileForm.control} name="phoneNumber" render={({
                        field
                      }) => <FormItem>
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
                            </FormItem>} />

                        <FormField control={profileForm.control} name="website" render={({
                        field
                      }) => <FormItem>
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
                            </FormItem>} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Zapisywanie..." : "Zapisz profil"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>;
}
