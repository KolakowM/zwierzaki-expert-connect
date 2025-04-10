
import { FileText, Mail, MapPin, Phone } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface ContactInfoTabProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

export function ContactInfoTab({ form, isSubmitting }: ContactInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dane kontaktowe</CardTitle>
        <CardDescription>
          Podaj dane kontaktowe, które będą widoczne dla potencjalnych klientów
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokalizacja</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="np. Warszawa, Mokotów" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Miasto lub dzielnica, w której przyjmujesz klientów
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numer telefonu</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="np. 123456789" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Numer telefonu do kontaktu z klientami
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="email@example.com" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Adres email do kontaktu z klientami
              </FormDescription>
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
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="np. www.twoja-strona.pl" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Twoja strona internetowa (opcjonalnie)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
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
