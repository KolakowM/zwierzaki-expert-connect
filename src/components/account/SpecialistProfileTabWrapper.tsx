
import { ProfileFormValues, SpecialistProfileTab } from "@/components/profile/SpecialistProfileTab";
import { UseFormReturn } from "react-hook-form";

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
  addEducation: (index: number) => void;
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
  );
}
