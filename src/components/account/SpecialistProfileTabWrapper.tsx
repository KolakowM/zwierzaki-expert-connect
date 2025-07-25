
import React from 'react';
import { SpecialistProfileTab, ProfileFormValues } from '@/components/profile/SpecialistProfileTab';
import { UseFormReturn } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Form } from '@/components/ui/form';
import { FormErrorSummary } from '@/components/ui/form-error-summary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SpecialistProfileTabWrapperProps {
  profileForm: UseFormReturn<ProfileFormValues>;
  specialistActiveTab: string;
  setSpecialistActiveTab: (tab: string) => void;
  onProfileSubmit: (values: ProfileFormValues) => void;
  photoUrl: string | null;
  userId: string | undefined;
  services: string[];
  education: string[];
  isProfileSubmitting: boolean;
  updateService: (index: number, value: string) => void;
  removeService: (index: number) => void;
  addService: () => void;
  updateEducation: (index: number, value: string) => void;
  removeEducation: (index: number) => void;
  addEducation: () => void;
  onPhotoChange: (url: string | null, file: File | null) => void;
  isLoadingProfile: boolean;
}

export function SpecialistProfileTabWrapper({
  profileForm,
  specialistActiveTab,
  setSpecialistActiveTab,
  onProfileSubmit,
  photoUrl,
  userId,
  services,
  education,
  isProfileSubmitting,
  updateService,
  removeService,
  addService,
  updateEducation,
  removeEducation,
  addEducation,
  onPhotoChange,
  isLoadingProfile
}: SpecialistProfileTabWrapperProps) {
  // Jeśli brak userId, pokazujemy alert
  if (!userId) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Błąd autoryzacji</AlertTitle>
        <AlertDescription>
          Nie udało się załadować Twojego profilu. Zaloguj się ponownie lub skontaktuj się z administratorem.
        </AlertDescription>
      </Alert>
    );
  }

  // Jeśli profil jest w trakcie ładowania, pokazujemy skeleton
  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  // Obsługa submitu przez react-hook-form, zapobiega domyślnej akcji formularza
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony
    
    const values = profileForm.getValues();
    
    // Walidacja formularza
    profileForm.trigger().then(isValid => {
      if (isValid) {
        console.log("Walidacja formularza poprawna, przesyłanie danych:", values);
        onProfileSubmit(values);
      } else {
        console.error("Błędy walidacji formularza:", profileForm.formState.errors);
      }
    });
  };

  return (
    <Form {...profileForm}>
      <FormErrorSummary form={profileForm} />
      
      <form onSubmit={handleSubmit} noValidate>
        <SpecialistProfileTab
          form={profileForm}
          activeTab={specialistActiveTab}
          setActiveTab={setSpecialistActiveTab}
          onSubmit={onProfileSubmit}
          photoUrl={photoUrl}
          userId={userId}
          services={services}
          education={education}
          isSubmitting={isProfileSubmitting}
          updateService={updateService}
          removeService={removeService}
          addService={addService}
          updateEducation={updateEducation}
          removeEducation={removeEducation}
          addEducation={addEducation}
          onPhotoChange={onPhotoChange}
        />
      </form>
    </Form>
  );
}
