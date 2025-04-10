
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layout/MainLayout";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Mail, Lock, Award } from "lucide-react";
import { useProfileForm } from "@/hooks/useProfileForm";
import { profileFormSchema, ProfileFormValues } from "@/components/profile/SpecialistProfileTab";
import { SpecialistProfileTab } from "@/components/profile/SpecialistProfileTab";
import { AccountGeneralTab } from "@/components/account/AccountGeneralTab";
import { PasswordTab } from "@/components/account/PasswordTab";
import { SecurityInfo } from "@/components/account/PasswordTab";
import { DeleteAccountDialog } from "@/components/account/DeleteAccountDialog";
import { useAccountSettings } from "@/hooks/useAccountSettings";
import { usePasswordSettings } from "@/hooks/usePasswordSettings";
import { useSpecialistSettingsTab } from "@/hooks/useSpecialistSettingsTab";
import { useEffect, useState } from "react";

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
    handleLogout
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

  // Update profileForm when specialistProfile is loaded
  useEffect(() => {
    if (specialistProfile && !isLoadingProfile) {
      // Initialize a default empty social media object
      const socialMedia = {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
        twitch: ""
      };
      
      // Safely extract social media data
      if (specialistProfile.social_media && typeof specialistProfile.social_media === 'object') {
        const sm = specialistProfile.social_media;
        if (typeof sm.facebook === 'string') socialMedia.facebook = sm.facebook;
        if (typeof sm.instagram === 'string') socialMedia.instagram = sm.instagram;
        if (typeof sm.twitter === 'string') socialMedia.twitter = sm.twitter;
        if (typeof sm.linkedin === 'string') socialMedia.linkedin = sm.linkedin;
        if (typeof sm.youtube === 'string') socialMedia.youtube = sm.youtube;
        if (typeof sm.tiktok === 'string') socialMedia.tiktok = sm.tiktok;
        if (typeof sm.twitch === 'string') socialMedia.twitch = sm.twitch;
      }
      
      // Update services and education arrays
      if (Array.isArray(specialistProfile.services)) {
        const svcs = [...specialistProfile.services];
        while (services.length < svcs.length) addService();
        svcs.forEach((svc, idx) => updateService(idx, svc));
      }
      
      if (Array.isArray(specialistProfile.education)) {
        const edu = [...specialistProfile.education];
        while (education.length < edu.length) addEducation();
        edu.forEach((item, idx) => updateEducation(idx, item));
      }
      
      // Reset form with specialist profile data
      profileForm.reset({
        title: specialistProfile.title || "",
        description: specialistProfile.description || "",
        specializations: specialistProfile.specializations || [],
        services: specialistProfile.services || [],
        education: specialistProfile.education || [],
        experience: specialistProfile.experience || "",
        location: specialistProfile.location || "",
        phoneNumber: specialistProfile.phone_number || "",
        email: user?.email || "",
        website: specialistProfile.website || "",
        socialMedia
      });
      
      // Set photo URL if available
      if (specialistProfile.photo_url) {
        handlePhotoChange(specialistProfile.photo_url, null);
      }
    }
  }, [specialistProfile, isLoadingProfile, user?.email, profileForm, addService, updateService, education, services, addEducation, updateEducation, handlePhotoChange]);

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
    return <div />;
  }
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Ustawienia konta</h1>
          </div>

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
              {isLoadingProfile ? (
                <div className="p-8 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Ładowanie profilu specjalisty...</p>
                </div>
              ) : (
                <SpecialistProfileTab
                  form={profileForm}
                  activeTab={specialistActiveTab}
                  setActiveTab={setSpecialistActiveTab}
                  onSubmit={onProfileSubmit}
                  photoUrl={photoUrl}
                  userId={user?.id}
                  services={services}
                  education={education}
                  isSubmitting={isProfileSubmitting}
                  updateService={updateService}
                  removeService={removeService}
                  addService={addService}
                  updateEducation={updateEducation}
                  removeEducation={removeEducation}
                  addEducation={addEducation}
                  onPhotoChange={handlePhotoChange}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
