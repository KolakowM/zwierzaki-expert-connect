
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccountGeneralTab } from "./AccountGeneralTab";
import { PasswordTab } from "./PasswordTab";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { SpecialistProfileTabWrapper } from "./SpecialistProfileTabWrapper";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";

interface AccountSettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accountForm: UseFormReturn<any>;
  passwordForm: UseFormReturn<any>;
  onAccountSubmit: (values: any) => void;
  handlePasswordSubmit: (values: any) => void;
  handleLogout: () => void;
  isPasswordSubmitting: boolean;
  specialistProfile: any;
  isLoadingProfile: boolean;
  isLoadingUserProfile: boolean;
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
}

export function AccountSettingsTabs({
  activeTab,
  setActiveTab,
  accountForm,
  passwordForm,
  onAccountSubmit,
  handlePasswordSubmit,
  handleLogout,
  isPasswordSubmitting,
  specialistProfile,
  isLoadingProfile,
  isLoadingUserProfile,
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
  onPhotoChange
}: AccountSettingsTabsProps) {
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">Dane profilu</TabsTrigger>
        <TabsTrigger value="password">Hasło i bezpieczeństwo</TabsTrigger>
        <TabsTrigger value="specialist">Profil specjalisty</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <form onSubmit={accountForm.handleSubmit(onAccountSubmit)}>
          <AccountGeneralTab 
            form={accountForm}
            isSubmitting={accountForm.formState.isSubmitting}
            specialistProfile={specialistProfile}
            isLoadingProfile={isLoadingProfile}
            isLoadingUserProfile={isLoadingUserProfile}
          />
        </form>
      </TabsContent>
      
      <TabsContent value="password">
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
          <PasswordTab 
            form={passwordForm}
            isSubmitting={isPasswordSubmitting}
          />
        </form>
        
        <div className="mt-6">
          <DeleteAccountDialog onConfirm={handleLogout} />
        </div>
      </TabsContent>
      
      <TabsContent value="specialist">
        <SpecialistProfileTabWrapper
          profileForm={profileForm}
          specialistActiveTab={specialistActiveTab}
          setSpecialistActiveTab={setSpecialistActiveTab}
          onProfileSubmit={onProfileSubmit}
          photoUrl={photoUrl}
          userId={userId}
          services={services}
          education={education}
          isProfileSubmitting={isProfileSubmitting}
          updateService={updateService}
          removeService={removeService}
          addService={addService}
          updateEducation={updateEducation}
          removeEducation={removeEducation}
          addEducation={addEducation}
          onPhotoChange={onPhotoChange}
          isLoadingProfile={isLoadingProfile}
        />
      </TabsContent>
    </Tabs>
  );
}
