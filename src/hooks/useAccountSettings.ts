
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

// Form schemas
export const accountFormSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
  email: z.string().email("Wprowadź poprawny adres email"),
});

export const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
  newPassword: z.string().min(8, "Nowe hasło musi mieć co najmniej 8 znaków"),
  confirmPassword: z.string().min(8, "Potwierdź nowe hasło")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"]
});

// Types based on schemas
export type AccountFormValues = z.infer<typeof accountFormSchema>;
export type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function useAccountSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [specialistProfile, setSpecialistProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [specialistActiveTab, setSpecialistActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true);

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

  // Load user data into the form when available
  useEffect(() => {
    if (user) {
      // Fetch user profile data from user_profiles table
      const fetchUserProfile = async () => {
        setIsLoadingUserProfile(true);
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          console.log("Loaded user profile data:", data);
          setUserProfile(data);
          
          // Reset the form with data from both user auth and user_profiles
          accountForm.reset({
            firstName: data?.first_name || "",
            lastName: data?.last_name || "",
            email: user.email || ""
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Still set the email from auth user
          accountForm.setValue('email', user.email || "");
        } finally {
          setIsLoadingUserProfile(false);
        }
      };
      
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
            console.log("Loaded specialist profile:", data);
            setSpecialistProfile(data);
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
      
      fetchUserProfile();
      fetchSpecialistProfile();
    }
  }, [user, accountForm, toast]);

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
    console.log("Submitting account form with values:", values);
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
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
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
  
  function handleLogout() {
    logout();
    toast({
      title: "Konto usunięte",
      description: "Twoje konto zostało usunięte. Przekierowujemy Cię do strony głównej.",
      variant: "destructive"
    });
    navigate("/");
  }

  return {
    user,
    isAuthenticated,
    activeTab,
    setActiveTab,
    specialistProfile,
    isLoadingProfile,
    specialistActiveTab,
    setSpecialistActiveTab,
    isSubmitting,
    setIsSubmitting,
    accountForm,
    passwordForm,
    onAccountSubmit,
    handleLogout,
    userProfile,
    isLoadingUserProfile
  };
}
