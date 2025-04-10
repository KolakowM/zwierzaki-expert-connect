
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { BasicInfoTab } from "./BasicInfoTab";
import { SpecializationsTab } from "./SpecializationsTab";
import { ContactInfoTab } from "./ContactInfoTab";
import { ProfileSocialMediaTab } from "./ProfileSocialMediaTab";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// Schema for specialist profile
export const profileFormSchema = z.object({
  title: z.string().min(2, "Tytuł musi mieć co najmniej 2 znaki"),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków"),
  specializations: z.array(z.string()).min(1, "Wybierz co najmniej jedną specjalizację"),
  services: z.array(z.string()).min(1, "Dodaj co najmniej jedną usługę"),
  education: z.array(z.string()),
  experience: z.string(),
  location: z.string().min(2, "Lokalizacja musi mieć co najmniej 2 znaki"),
  phoneNumber: z.string().optional(), // Changed from required to optional
  email: z.string().email("Wprowadź poprawny adres email"),
  website: z.string().optional(),
  socialMedia: z.object({
    facebook: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
    instagram: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
    twitter: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
    linkedin: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
    youtube: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
    tiktok: z.string().url("Wprowadź poprawny URL").optional().or(z.literal("")),
    twitch: z.string().url("Wprowadź poprawny URL").optional().or(z.literal(""))
  }).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface SpecialistProfileTabProps {
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

export function SpecialistProfileTab({
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
}: SpecialistProfileTabProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Dane podstawowe</TabsTrigger>
            <TabsTrigger value="specializations">Specjalizacje</TabsTrigger>
            <TabsTrigger value="contact">Kontakt</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoTab
              form={form}
              photoUrl={photoUrl}
              education={education}
              userId={userId}
              updateEducation={updateEducation}
              removeEducation={removeEducation}
              addEducation={addEducation}
              onPhotoChange={onPhotoChange}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="specializations">
            <SpecializationsTab
              form={form}
              services={services}
              updateService={updateService}
              removeService={removeService}
              addService={addService}
              isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="contact">
            <ContactInfoTab
              form={form}
              isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="social">
            <ProfileSocialMediaTab
              form={form}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
