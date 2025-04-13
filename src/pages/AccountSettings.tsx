
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layout/MainLayout";
import { UserCircle } from "lucide-react";
import { useProfileForm } from "@/hooks/useProfileForm";
import { profileFormSchema, ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { usePasswordSettings } from "@/hooks/usePasswordSettings";
import { useSpecialistSettingsTab } from "@/hooks/useSpecialistSettingsTab";
import { useProfileFormInitialization } from "@/hooks/useProfileFormInitialization";
import { AccountSettingsTabs } from "@/components/account/AccountSettingsTabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountSettings() {
  // Get account settings hooks
  const {
    user,
    isAuthenticated,
    activeTab,
    setActiveTab,
    specialistProfile,
    isLoadingProfile,
    specialistActiveTab,
    setSpecialistActiveTab,
    accountForm,
    passwordForm,
    onAccountSubmit,
    handleLogout,
    isLoadingUserProfile
  } = useAccountSettings();

  // Get password settings hook
  const { isSubmitting: isPasswordSubmitting, onPasswordSubmit } = usePasswordSettings();

  // Get profile form hooks
  const {
    services,
    education,
    photoUrl,
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

  // Get specialist profile hooks
  const { isSubmitting: isProfileSubmitting, onProfileSubmit } = useSpecialistSettingsTab(
    user?.id,
    specialistProfile,
    uploadProfilePhoto,
    photoUrl,
    services,
    education,
    processFormData
  );

  // Initialize specialist profile form
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

  // Initialize profile form when data is loaded
  useProfileFormInitialization(
    profileForm,
    specialistProfile,
    isLoadingProfile,
    user,
    addService,
    updateService,
    services,
    addEducation,
    updateEducation,
    education,
    handlePhotoChange
  );

  // Handle password form submission
  const handlePasswordSubmit = (values: any) => {
    onPasswordSubmit(values, () => {
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    });
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="flex justify-center">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Ustawienia konta</h1>
          </div>

          <AccountSettingsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            accountForm={accountForm}
            passwordForm={passwordForm}
            onAccountSubmit={onAccountSubmit}
            handlePasswordSubmit={handlePasswordSubmit}
            handleLogout={handleLogout}
            isPasswordSubmitting={isPasswordSubmitting}
            specialistProfile={specialistProfile}
            isLoadingProfile={isLoadingProfile}
            isLoadingUserProfile={isLoadingUserProfile}
            profileForm={profileForm}
            specialistActiveTab={specialistActiveTab}
            setSpecialistActiveTab={setSpecialistActiveTab}
            onProfileSubmit={onProfileSubmit}
            photoUrl={photoUrl}
            userId={user?.id}
            services={services}
            education={education}
            isProfileSubmitting={isProfileSubmitting}
            updateService={updateService}
            removeService={removeService}
            addService={addService}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            addEducation={addEducation}
            onPhotoChange={handlePhotoChange}
          />
        </div>
      </div>
    </MainLayout>
  );
}
