
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { UseFormReturn } from "react-hook-form";
import { useSpecialistSpecializationsManager } from "@/data/specializations";
import { ErrorToastDetails } from "@/components/ui/error-toast-detail";

interface UseProfileFormSubmitProps {
  form: UseFormReturn<ProfileFormValues>;
  userId: string | undefined;
  initialData: any;
  photoUrl: string | null;
  services: string[];
  education: string[];
  setActiveTab: (tab: string) => void;
  activeTab: string;
  setSaveSuccess: (value: boolean) => void;
  setSaveError: (value: string | null) => void;
  uploadProfilePhoto: (userId: string) => Promise<string | null>;
  processFormData: (formData: any, userId?: string, photoUrl?: string | null) => any;
}

export const useProfileFormSubmit = ({
  form,
  userId,
  initialData,
  photoUrl,
  services,
  education,
  setActiveTab,
  activeTab,
  setSaveSuccess,
  setSaveError,
  uploadProfilePhoto,
  processFormData
}: UseProfileFormSubmitProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveSpecializations } = useSpecialistSpecializationsManager(userId);

  // Funkcja obsługująca zapisywanie formularza
  const onSubmit = async (values: ProfileFormValues) => {
    if (!userId) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany, aby edytować profil",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Resetuj stany powiadomień
      setSaveError(null);
      setSaveSuccess(false);
      setIsSubmitting(true);
      console.log('Zapisywanie profilu z wartościami:', values);
      console.log('ID użytkownika:', userId);
      console.log('Aktualna tablica usług:', services);
      console.log('Aktualna tablica edukacji:', education);
      
      // Filtruj puste pola z tablic services i education
      const filteredServices = services.filter(s => s.trim() !== "");
      const filteredEducation = education.filter(e => e.trim() !== "");
      
      console.log('Przefiltrowana tablica usług:', filteredServices);
      console.log('Przefiltrowana tablica edukacji:', filteredEducation);
      
      // Dodaj aktualne tablice services i education do values
      const formDataToSave = {
        ...values,
        services: filteredServices,
        education: filteredEducation
      };
      
      // Prześlij zdjęcie jeśli zostało zmienione
      let photoUrlToSave = initialData?.photo_url;
      
      if (photoUrl && photoUrl !== initialData?.photo_url) {
        photoUrlToSave = await uploadProfilePhoto(userId);
      }
      
      // Przygotuj dane do zapisu
      const profileData = processFormData(formDataToSave, userId, photoUrlToSave);
      
      console.log('Zapisywanie danych profilu:', profileData);
      
      // CRITICAL FIX: Upewnij się, że ID jest poprawnie ustawione
      if (profileData.id !== userId) {
        console.error('Niezgodność ID wykryta. Ustawianie poprawnego ID użytkownika:', userId);
        profileData.id = userId;
      }
      
      // Zapisz do Supabase
      const { data, error } = await supabase
        .from('specialist_profiles')
        .upsert(profileData)
        .select();
        
      if (error) {
        console.error('Supabase error details:', error);
        if (error.message.includes('row-level security policy')) {
          throw new Error('Brak uprawnień do edycji profilu. Sprawdź czy jesteś zalogowany jako właściciel profilu.');
        }
        throw error;
      }
      
      console.log('Odpowiedź po zapisie profilu:', data);
      
      // Zapisz specjalizacje niezależnie od aktywnej zakładki
      if (values.specializations && values.specializations.length > 0) {
        console.log('Aktualizacja aktywnych specjalizacji:', values.specializations);
        const { success, error: specError } = await saveSpecializations(values.specializations);
        
        if (!success) {
          console.error('Błąd zapisywania specjalizacji:', specError);
          throw new Error(specError || 'Błąd zapisywania specjalizacji');
        }
      } else {
        console.warn("Brak zaznaczonych aktywnych specjalizacji");
        // Aktualizuj wszystkie specjalizacje jako nieaktywne
        const { success, error: specError } = await saveSpecializations([]);
        
        if (!success) {
          console.error('Błąd aktualizowania specjalizacji:', specError);
        }
      }
      
      // Pokaż powiadomienie o sukcesie
      setSaveSuccess(true);
      toast({
        title: "Zapisano",
        description: "Twój profil został pomyślnie zapisany",
      });
      
      // Przejdź do następnej zakładki po zapisaniu informacji podstawowych
      if (activeTab === "basic") {
        setActiveTab("specializations");
      } else if (activeTab === "specializations") {
        setActiveTab("contact");
      } else if (activeTab === "contact") {
        setActiveTab("social");
      }
      
      // Wyczyść komunikat o sukcesie po 5 sekundach
      setTimeout(() => {
        setSaveSuccess(false);
      }, 5000);
      
    } catch (error: any) {
      console.error('Błąd zapisywania profilu:', error);
      setSaveError(error instanceof Error ? error.message : "Nieznany błąd podczas zapisywania profilu");
      
      // Pokaż powiadomienie o błędzie
      const errorFields = Object.keys(form.formState.errors);
      
      toast({
        title: "Błąd",
        description: <ErrorToastDetails 
          message="Nie udało się zapisać profilu"
          error={error instanceof Error ? error.message : "Nieznany błąd"}
          fields={errorFields}
        />,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    setIsSubmitting,
    onSubmit
  };
};
