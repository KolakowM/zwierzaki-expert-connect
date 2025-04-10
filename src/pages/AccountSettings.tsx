
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider"; 
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Mail, Lock, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SocialMediaLinks } from "@/types";
import { useProfileForm } from "@/hooks/useProfileForm";
import { SpecialistProfileTab, profileFormSchema, ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { AccountGeneralTab } from "@/components/account/AccountGeneralTab";
import { PasswordTab, SecurityInfo } from "@/components/account/PasswordTab";
import { DeleteAccountDialog } from "@/components/account/DeleteAccountDialog";
import { updateUserPassword } from "@/services/authService";

// Form schemas
const accountFormSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
  email: z.string().email("Wprowadź poprawny adres email"),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
  newPassword: z.string().min(8, "Nowe hasło musi mieć co najmniej 8 znaków"),
  confirmPassword: z.string().min(8, "Potwierdź nowe hasło")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"]
});

// Types based on schemas
type AccountFormValues = z.infer<typeof accountFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function AccountSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [specialistProfile, setSpecialistProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [specialistActiveTab, setSpecialistActiveTab] = useState("basic");

  const {
    services,
    education,
    photoUrl,
    isSubmitting,
    setIsSubmitting,
    uploadProfilePhoto,
    addService,
    updateService,
    removeService,
    addEducation,
    updateEducation,
    removeEducation,
    handlePhotoChange,
    processFormData,
  } = useProfileForm();

  // Initialize forms
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: ""
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
      email: user?.email || "",
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
        email: user.email || ""
      });
      
      // Fetch specialist profile data if user is authenticated
      const fetchSpecialistProfile = async () => {
        setIsLoadingProfile(true);
        try {
          const { data, error } = await supabase
            .from('specialist_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) throw error;
          
          if (data) {
            setSpecialistProfile(data);
            
            // Set photo URL if it exists
            if (data.photo_url) {
              handlePhotoChange(data.photo_url, null);
            }
            
            // Initialize a default empty social media object
            const socialMediaDefault: SocialMediaLinks = {
              facebook: "",
              instagram: "",
              twitter: "",
              linkedin: "",
              youtube: "",
              tiktok: "",
              twitch: ""
            };
            
            // Safely extract social media data with proper type checking
            let socialMediaData: SocialMediaLinks = socialMediaDefault;
            
            if (data.social_media && typeof data.social_media === 'object' && !Array.isArray(data.social_media)) {
              const socialMediaObj = data.social_media as Record<string, unknown>;
              
              // Safely extract each property with type checking
              if (typeof socialMediaObj.facebook === 'string') socialMediaData.facebook = socialMediaObj.facebook;
              if (typeof socialMediaObj.instagram === 'string') socialMediaData.instagram = socialMediaObj.instagram;
              if (typeof socialMediaObj.twitter === 'string') socialMediaData.twitter = socialMediaObj.twitter;
              if (typeof socialMediaObj.linkedin === 'string') socialMediaData.linkedin = socialMediaObj.linkedin;
              if (typeof socialMediaObj.youtube === 'string') socialMediaData.youtube = socialMediaObj.youtube;
              if (typeof socialMediaObj.tiktok === 'string') socialMediaData.tiktok = socialMediaObj.tiktok;
              if (typeof socialMediaObj.twitch === 'string') socialMediaData.twitch = socialMediaObj.twitch;
            }
              
            // Initialize form values with database data
            const formValues = {
              title: data.title || "",
              description: data.description || "",
              specializations: data.specializations || [],
              services: data.services || [],
              education: data.education || [],
              experience: data.experience || "",
              location: data.location || "",
              phoneNumber: data.phone_number || "",
              email: user.email || "",
              website: data.website || "",
              socialMedia: socialMediaData
            };
            
            profileForm.reset(formValues);
            
            // Initialize services state array - ensure it's not empty
            if (data.services && data.services.length > 0) {
              updateService(0, data.services[0] || "");
              for (let i = 1; i < data.services.length; i++) {
                addService();
                updateService(i, data.services[i] || "");
              }
            }
            
            // Initialize education state array - ensure it's not empty
            if (data.education && data.education.length > 0) {
              updateEducation(0, data.education[0] || "");
              for (let i = 1; i < data.education.length; i++) {
                addEducation();
                updateEducation(i, data.education[i] || "");
              }
            }
          }
        } catch (error) {
          console.error("Error fetching specialist profile:", error);
          toast({
            title: "Błąd",
            description: "Nie udało się pobrać danych profilu specjalisty",
            variant: "destructive"
          });
        } finally {
          setIsLoadingProfile(false);
        }
      };
      
      fetchSpecialistProfile();
    }
  }, [user]);

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

  // Form submission handlers
  async function onAccountSubmit(values: AccountFormValues) {
    try {
      setIsSubmitting(true);
      
      // Update user profile in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user?.id,
          first_name: values.firstName,
          last_name: values.lastName,
          updated_at: new Date().toISOString()
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
      
      // Upload profile photo if changed
      let photoUrlToSave = specialistProfile?.photo_url || null;
      if (photoUrl) {
        const uploadedUrl = await uploadProfilePhoto(user?.id || "");
        if (uploadedUrl) {
          photoUrlToSave = uploadedUrl;
        }
      }
      
      // Create the payload to update
      const profileData = processFormData(values, user?.id);
      
      // Explicitly add the photo_url to the profileData
      profileData.photo_url = photoUrlToSave;
      
      // Update specialist profile in Supabase
      const { error } = await supabase
        .from('specialist_profiles')
        .upsert(profileData);
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      toast({
        title: "Profil zaktualizowany",
        description: "Twój profil specjalisty został pomyślnie zaktualizowany."
      });
      
      // Update local state
      setSpecialistProfile({
        ...specialistProfile,
        ...profileData
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
  
  return (
    <MainLayout>
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
              <Form {...accountForm}>
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)}>
                  <AccountGeneralTab
                    form={accountForm}
                    isSubmitting={isSubmitting}
                    specialistProfile={specialistProfile}
                    isLoadingProfile={isLoadingProfile}
                  />
                </form>
              </Form>
            </TabsContent>

            {/* Password change and security tab */}
            <TabsContent value="password">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <PasswordTab 
                    form={passwordForm}
                    isSubmitting={isSubmitting}
                  />
                </form>
              </Form>

              <SecurityInfo />
              
              <DeleteAccountDialog onDeleteAccount={handleDeleteAccount} />
            </TabsContent>

            {/* Specialist profile tab */}
            <TabsContent value="specialist">
              <SpecialistProfileTab
                form={profileForm}
                activeTab={specialistActiveTab}
                setActiveTab={setSpecialistActiveTab}
                onSubmit={onProfileSubmit}
                photoUrl={photoUrl}
                userId={user?.id}
                services={services}
                education={education}
                isSubmitting={isSubmitting}
                updateService={updateService}
                removeService={removeService}
                addService={addService}
                updateEducation={updateEducation}
                removeEducation={removeEducation}
                addEducation={addEducation}
                onPhotoChange={handlePhotoChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
