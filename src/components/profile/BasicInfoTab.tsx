
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EducationFieldsArray } from "./EducationFieldsArray";
import { ProfilePhotoUploader } from "./ProfilePhotoUploader";
import { UseFormReturn } from "react-hook-form";

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
  photoUrl: string | null;
  education: string[];
  userId: string | undefined;
  updateEducation: (index: number, value: string) => void;
  removeEducation: (index: number) => void;
  addEducation: () => void;
  onPhotoChange: (url: string | null, file: File | null) => void;
  isSubmitting: boolean;
}

export function BasicInfoTab({
  form,
  photoUrl,
  education,
  userId,
  updateEducation,
  removeEducation,
  addEducation,
  onPhotoChange,
  isSubmitting
}: BasicInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dane podstawowe</CardTitle>
        <CardDescription>
          Przedstaw się swoim potencjalnym klientom.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile photo */}
        <ProfilePhotoUploader 
          initialPhotoUrl={photoUrl} 
          userId={userId}
          onPhotoChange={onPhotoChange}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł zawodowy</FormLabel>
              <FormControl>
                <Input placeholder="np. Dietetyk zwierzęcy, Behawiorysta psów" {...field} />
              </FormControl>
              <FormDescription>
                Tytuł zawodowy, który będzie widoczny w twoim profilu
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Opisz swoją specjalizację, doświadczenie i podejście do pracy..." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Szczegółowy opis Twojej działalności, doświadczenia i metod pracy
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience */}
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doświadczenie</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Opisz swoje doświadczenie zawodowe..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Opisz swoje doświadczenie zawodowe, np. lata praktyki, współpraca z klinikami
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Education */}
        <EducationFieldsArray
          education={education}
          updateEducation={updateEducation}
          removeEducation={removeEducation}
          addEducation={addEducation}
        />
      </CardContent>
      <CardFooter>
        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : "Zapisz profil"}
        </Button>
      </CardFooter>
    </Card>
  );
}
