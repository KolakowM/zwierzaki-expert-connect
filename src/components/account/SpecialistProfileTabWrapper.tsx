
import { ProfileFormValues, SpecialistProfileTab } from "@/components/profile/SpecialistProfileTab";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useRef } from "react";

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
  // Use a ref to track previous props to avoid unnecessary logging
  const prevPropsRef = useRef({ specialistActiveTab, services, education, photoUrl, isLoadingProfile });
  
  // Log each time component renders with its data - ONLY when relevant props change
  useEffect(() => {
    const currentProps = { specialistActiveTab, services, education, photoUrl, isLoadingProfile };
    const prevProps = prevPropsRef.current;
    
    const hasChanged = 
      prevProps.specialistActiveTab !== specialistActiveTab || 
      prevProps.services !== services || 
      prevProps.education !== education || 
      prevProps.photoUrl !== photoUrl || 
      prevProps.isLoadingProfile !== isLoadingProfile;
    
    if (hasChanged) {
      console.log("SpecialistProfileTabWrapper rendering with:", {
        ...currentProps,
        formValues: profileForm.getValues()
      });
      prevPropsRef.current = currentProps;
    }
  }, [specialistActiveTab, services, education, photoUrl, isLoadingProfile, profileForm]);

  // Use a separate ref to control subscription to form changes
  const formWatchRef = useRef<any>(null);
  
  // Log form values when they change - with cleanup to prevent memory leaks
  useEffect(() => {
    if (formWatchRef.current) {
      formWatchRef.current.unsubscribe();
    }
    
    formWatchRef.current = profileForm.watch((value) => {
      console.log("SpecialistProfileTabWrapper - profileForm values changed:", value);
    });
    
    return () => {
      if (formWatchRef.current) {
        formWatchRef.current.unsubscribe();
      }
    };
  }, [profileForm]);

  // Ensure form submission is properly triggered
  const handleSubmit = (values: ProfileFormValues) => {
    console.log("SpecialistProfileTabWrapper - handleSubmit called with:", values);
    console.log("Current services and education:", { services, education });
    
    // Make sure the form includes current services and education
    const valuesWithArrays = {
      ...values,
      services: services.filter(s => s.trim() !== ""),
      education: education.filter(e => e.trim() !== "")
    };
    
    onProfileSubmit(valuesWithArrays);
  };

  if (isLoadingProfile) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Ładowanie profilu specjalisty...</p>
      </div>
    );
  }

  return (
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
  );
}
