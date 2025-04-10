
import { SpecialistProfileTab } from "@/components/profile/SpecialistProfileTab";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { UseFormReturn } from "react-hook-form";

interface ProfileFormWrapperProps {
  form: UseFormReturn<ProfileFormValues>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSubmit: (values: ProfileFormValues) => void;
  photoUrl: string | null;
  userId: string | undefined;
  services: string[];
  education: string[];
  isSubmitting: boolean;
  updateService: (index: number, value: string) => void;
  removeService: (index: number) => void;
  addService: () => void;
  updateEducation: (index: number, value: string) => void;
  removeEducation: (index: number) => void;
  addEducation: () => void;
  onPhotoChange: (url: string | null, file: File | null) => void;
}

export function ProfileFormWrapper({
  form,
  activeTab,
  setActiveTab,
  onSubmit,
  photoUrl,
  userId,
  services,
  education,
  isSubmitting,
  updateService,
  removeService,
  addService,
  updateEducation,
  removeEducation,
  addEducation,
  onPhotoChange
}: ProfileFormWrapperProps) {
  return (
    <SpecialistProfileTab
      form={form}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onSubmit={onSubmit}
      photoUrl={photoUrl}
      userId={userId}
      services={services}
      education={education}
      isSubmitting={isSubmitting}
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
