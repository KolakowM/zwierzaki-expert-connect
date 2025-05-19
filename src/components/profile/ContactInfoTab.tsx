
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./SpecialistProfileTab";

interface ContactInfoTabProps {
  form: UseFormReturn<ProfileFormValues>;
  isSubmitting: boolean;
}

export function ContactInfoTab({ form, isSubmitting }: ContactInfoTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Dane kontaktowe</h3>
        <p className="text-sm text-muted-foreground">
          Podaj dane kontaktowe, które będą widoczne na Twoim profilu
        </p>
      </div>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miasto</FormLabel>
              <FormControl>
                <Input placeholder="np. Warszawa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon kontaktowy</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="np. 123 456 789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email kontaktowy</FormLabel>
              <FormControl>
                <Input type="email" placeholder="np. jan.kowalski@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strona internetowa</FormLabel>
              <FormControl>
                <Input type="url" placeholder="np. https://moja-strona.pl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Zapisywanie..." : "Zapisz dane kontaktowe"}
      </Button>
    </div>
  );
}
