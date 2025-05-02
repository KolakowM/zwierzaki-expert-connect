
import React from 'react';
import { SpecialistProfileTab, ProfileFormValues } from '@/components/profile/SpecialistProfileTab';
import { UseFormReturn } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Form } from '@/components/ui/form';
import { FormErrorSummary } from '@/components/ui/form-error-summary';

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
  // If the profile is still loading, show a skeleton loading state
  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  // Custom submission handler that prevents default form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Zapobiega domyślnemu odświeżeniu strony
    
    const values = profileForm.getValues();
    
    // Log form values for debugging
    console.log("Form values being submitted:", values);
    
    // Ręczne walidowanie formularza
    profileForm.trigger().then(isValid => {
      if (isValid) {
        onProfileSubmit(values);
      } else {
        console.error("Form validation errors:", profileForm.formState.errors);
      }
    });
  };

  return (
    <Form {...profileForm}>
      <FormErrorSummary form={profileForm} />
      
      <form onSubmit={handleSubmit}>
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
