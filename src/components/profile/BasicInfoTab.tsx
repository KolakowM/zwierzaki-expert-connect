
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { EducationFieldsArray } from "./EducationFieldsArray";
import { useEffect } from "react";

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
  // Log form values when they change
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("BasicInfoTab - Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dane podstawowe</CardTitle>
        <CardDescription>
          Uzupełnij podstawowe informacje o sobie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo */}
        <ProfilePhotoUpload 
          photoUrl={photoUrl}
          userId={userId}
          onPhotoChange={onPhotoChange}
        />
        
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł zawodowy / specjalizacja</FormLabel>
              <FormControl>
                <Input 
                  placeholder="np. Psycholog, Dietetyk, Trener personalny" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Tytuł który najlepiej opisuje Twoją specjalizację
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
              <FormLabel>O mnie</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Napisz kilka słów o sobie, swoim doświadczeniu i ofercie"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokalizacja</FormLabel>
              <FormControl>
                <Input 
                  placeholder="np. Warszawa, Kraków, Poznań" 
                  {...field} 
                />
              </FormControl>
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
                  placeholder="Opisz swoje doświadczenie zawodowe"
                  {...field}
                />
              </FormControl>
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
