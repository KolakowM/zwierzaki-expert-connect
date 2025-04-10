
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialMediaInputs } from "./SocialMediaInputs";
import { UseFormReturn } from "react-hook-form";

interface ProfileSocialMediaTabProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

export function ProfileSocialMediaTab({ form, isSubmitting }: ProfileSocialMediaTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media społecznościowe</CardTitle>
        <CardDescription>
          Dodaj linki do swoich profili w mediach społecznościowych
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialMediaInputs form={form} />
      </CardContent>
      <CardFooter>
        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : "Zapisz profile"}
        </Button>
      </CardFooter>
    </Card>
  );
}
