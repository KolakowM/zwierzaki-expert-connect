
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useProfileForm } from "@/hooks/useProfileForm";
import { useSpecialistProfile } from "@/hooks/useSpecialistProfile";
import { useProfileFormSubmit } from "./ProfileFormSubmit";
import { ProfileFormSkeleton } from "./ProfileFormSkeleton";
import { ProfileFormWrapper } from "./ProfileFormWrapper";
import { ProfileNavigationButtons } from "./ProfileNavigationButtons";
import { ProfileNotifications } from "./ProfileNotifications";

const ProfileEditor = () => {
  const [activeTab, setActiveTab] = useState("basic");
  
  // Load profile data and form
  const {
    form,
    loading,
    initialData,
    saveError,
    saveSuccess,
    setSaveError,
    setSaveSuccess,
    userId
  } = useSpecialistProfile();

  // Get form helpers from useProfileForm
  const {
    services,
    education,
    photoUrl,
    isUploading,
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

  // Get form submission handler
  const { isSubmitting, setIsSubmitting, onSubmit } = useProfileFormSubmit({
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
  });

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Edytuj profil specjalisty</h1>
            <p className="text-muted-foreground">
              Uzupełnij informacje o sobie, aby potencjalni klienci mogli Cię lepiej poznać
            </p>
          </div>

          <ProfileNotifications 
            saveSuccess={saveSuccess} 
            saveError={saveError} 
          />

          {loading ? (
            <ProfileFormSkeleton />
          ) : (
            <ProfileFormWrapper
              form={form}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSubmit={onSubmit}
              photoUrl={photoUrl || initialData?.photo_url}
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
              onPhotoChange={handlePhotoChange}
            />
          )}

          <ProfileNavigationButtons 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSubmitting={isSubmitting}
            onSubmit={() => form.handleSubmit(onSubmit)()}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfileEditor;
