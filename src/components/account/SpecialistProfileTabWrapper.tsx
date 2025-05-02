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

  // Custom submission handler with error logging
  const handleSubmit = (values: ProfileFormValues) => {
    // Log form values for debugging
    console.log("Form values being submitted:", values);
    
    // Check if required fields are filled
    const requiredFields = ['title', 'description', 'specializations', 'location', 'email'];
    const missingFields = requiredFields.filter(field => {
      if (field === 'specializations') {
        return !values.specializations || values.specializations.length === 0;
      }
      return !values[field as keyof ProfileFormValues];
    });
    
    if (missingFields.length > 0) {
      console.warn("Missing required fields:", missingFields);
    }
    
    // Proceed with submission
    onProfileSubmit(values);
  };

  return (
    <Form {...profileForm}>
      <FormErrorSummary form={profileForm} />
      
      <form onSubmit={profileForm.handleSubmit(handleSubmit, (errors) => {
        console.error("Form validation errors:", errors);
      })}>
        <SpecialistProfileTab
          form={profileForm}
          activeTab={specialistActiveTab}
          setActiveTab={setSpecialistActiveTab}
          onSubmit={handleSubmit}
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
