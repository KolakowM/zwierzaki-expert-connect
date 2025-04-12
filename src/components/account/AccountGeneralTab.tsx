
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PhoneDisplayInfo, LocationDisplayInfo } from "./ProfileDisplayInfo";
import { useEffect } from "react";

interface AccountGeneralTabProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
  specialistProfile: any;
  isLoadingProfile: boolean;
}

export function AccountGeneralTab({ 
  form, 
  isSubmitting, 
  specialistProfile,
  isLoadingProfile
}: AccountGeneralTabProps) {
  
  // For debugging - log when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("AccountGeneralTab - Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dane profilu</CardTitle>
        <CardDescription>
          Zaktualizuj swoje dane osobowe i kontaktowe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField 
            control={form.control} 
            name="firstName" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input placeholder="Imię" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField 
            control={form.control} 
            name="lastName" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input placeholder="Nazwisko" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>
        
        <FormField 
          control={form.control} 
          name="email" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Email" {...field} disabled />
                </div>
              </FormControl>
              <FormDescription>
                Zmiana adresu email wymaga weryfikacji. Skontaktuj się z administratorem.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        {/* Read-only contact info with referral to specialist tab */}
        {!isLoadingProfile && (
          <>
            <PhoneDisplayInfo value={specialistProfile?.phone_number} />
            <LocationDisplayInfo value={specialistProfile?.location} />
          </>
        )}
        
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Numer telefonu i lokalizację możesz zaktualizować w zakładce "Profil specjalisty".
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
        </Button>
      </CardFooter>
    </Card>
  );
}
