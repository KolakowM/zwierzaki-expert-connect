
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { UserCircle, Mail, Lock, Award } from "lucide-react";
import { AccountGeneralTab } from "@/components/account/AccountGeneralTab";
import { PasswordTab } from "@/components/account/PasswordTab";
import { SecurityInfo } from "@/components/account/PasswordTab";
import { DeleteAccountDialog } from "@/components/account/DeleteAccountDialog";
import { SpecialistProfileTabWrapper } from "@/components/account/SpecialistProfileTabWrapper";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { useRef, useEffect } from "react";

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
  // Use a ref to track rendering and avoid excessive console.logs
  const renderCountRef = useRef(0);
  
  useEffect(() => {
    // Only log once every few renders to reduce console spam
    if (renderCountRef.current % 5 === 0) {
      console.log("AccountSettingsTabs rendering with accountForm values:", accountForm.getValues());
      console.log("Account form submission handler:", onAccountSubmit);
    }
    renderCountRef.current++;
  }, [accountForm, onAccountSubmit]);
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">
          <Mail className="mr-2 h-4 w-4" />
          Dane podstawowe
        </TabsTrigger>
        <TabsTrigger value="password">
          <Lock className="mr-2 h-4 w-4" />
          Hasło i bezpieczeństwo
        </TabsTrigger>
        <TabsTrigger value="specialist">
          <Award className="mr-2 h-4 w-4" />
          Profil specjalisty
        </TabsTrigger>
      </TabsList>

      {/* General account information tab */}
      <TabsContent value="general">
        <Form {...accountForm}>
          <form onSubmit={accountForm.handleSubmit(onAccountSubmit)}>
            <AccountGeneralTab
              form={accountForm}
              isSubmitting={isPasswordSubmitting}
              specialistProfile={specialistProfile}
              isLoadingProfile={isLoadingProfile}
            />
          </form>
        </Form>
      </TabsContent>

      {/* Password change and security tab */}
      <TabsContent value="password">
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
            <PasswordTab 
              form={passwordForm}
              isSubmitting={isPasswordSubmitting}
            />
          </form>
        </Form>

        <SecurityInfo />
        
        <DeleteAccountDialog onDeleteAccount={handleLogout} />
      </TabsContent>

      {/* Specialist profile tab */}
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
