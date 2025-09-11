import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccountGeneralTab } from "./AccountGeneralTab";
import { PasswordTab } from "./PasswordTab";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { SpecialistProfileTabWrapper } from "./SpecialistProfileTabWrapper";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { Form } from "@/components/ui/form";
import { TabErrorIndicator } from "@/components/ui/tab-error-indicator";
import { ErrorToast, FormError } from "@/components/ui/error-toast";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AccountSettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accountForm: UseFormReturn<any>;
  passwordForm: UseFormReturn<any>;
  onAccountSubmit: (values: any) => void;
  handlePasswordSubmit: (values: any) => void;
  handleLogout: () => void;
  handleDeleteAccount: (password: string) => Promise<void>;
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
  handleDeleteAccount,
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
  const { toast } = useToast();

  const getTabErrors = (formName: string) => {
    switch (formName) {
      case "account":
        return Object.keys(accountForm.formState.errors).length;
      case "password":
        return Object.keys(passwordForm.formState.errors).length;
      case "specialist":
        return Object.keys(profileForm.formState.errors).length;
      default:
        return 0;
    }
  };

  const handleFormError = (form: UseFormReturn<any>) => {
    const errors = Object.entries(form.formState.errors).map(([field, error]) => ({
      field,
      message: error.message as string,
      tabName: activeTab
    }));

    if (errors.length > 0) {
      // Display more visible error alert
      toast({
        title: "Formularz zawiera błędy",
        description: <ErrorToast errors={errors} onErrorClick={handleErrorClick} />,
        variant: "destructive",
      });
    }
  };

  const handleErrorClick = (error: FormError) => {
    // Switch to the appropriate tab if tabName is provided
    if (error.tabName) {
      setActiveTab(error.tabName);
    }
    
    // Focus the field with error
    const element = document.getElementById(error.field);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  };
  
  // Display validation errors for specialist tab
  const specialistTabHasErrors = Object.keys(profileForm.formState.errors).length > 0;
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general" className="relative">
          Dane profilu
          <TabErrorIndicator 
            count={getTabErrors("account")} 
            className="absolute -right-1 -top-1" 
          />
        </TabsTrigger>
        <TabsTrigger value="password" className="relative">
          Hasło i bezpieczeństwo
          <TabErrorIndicator 
            count={getTabErrors("password")} 
            className="absolute -right-1 -top-1" 
          />
        </TabsTrigger>
        <TabsTrigger value="specialist" className="relative">
          Profil specjalisty
          <TabErrorIndicator 
            count={getTabErrors("specialist")} 
            className="absolute -right-1 -top-1" 
          />
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Form {...accountForm}>
          <form onSubmit={accountForm.handleSubmit(onAccountSubmit, () => handleFormError(accountForm))}>
            <AccountGeneralTab 
              form={accountForm}
              isSubmitting={accountForm.formState.isSubmitting}
              specialistProfile={specialistProfile}
              isLoadingProfile={isLoadingProfile}
              isLoadingUserProfile={isLoadingUserProfile}
            />
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="password">
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit, () => handleFormError(passwordForm))}>
            <PasswordTab 
              form={passwordForm}
              isSubmitting={isPasswordSubmitting}
            />
          </form>
        </Form>
        
        <div className="mt-6">
          <DeleteAccountDialog onDeleteAccount={handleDeleteAccount} />
        </div>
      </TabsContent>
      
      <TabsContent value="specialist">
        {specialistTabHasErrors && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Formularz zawiera błędy</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 mt-2">
                {Object.entries(profileForm.formState.errors).map(([field, error]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {error.message as string}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
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
