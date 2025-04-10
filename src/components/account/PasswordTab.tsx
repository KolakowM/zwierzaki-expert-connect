
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface PasswordTabProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

export function PasswordTab({ form, isSubmitting }: PasswordTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zmień hasło</CardTitle>
        <CardDescription>
          Aktualizuj swoje hasło, aby zabezpieczyć konto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField 
          control={form.control} 
          name="currentPassword" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obecne hasło</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="newPassword" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nowe hasło</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="confirmPassword" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potwierdź nowe hasło</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zmienianie hasła..." : "Zmień hasło"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function SecurityInfo() {
  return (
    <Card className="mt-6 border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-amber-500" />
          <CardTitle>Bezpieczeństwo konta</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Dla zwiększenia bezpieczeństwa, zalecamy regularne zmienianie hasła
          oraz włączenie weryfikacji dwuetapowej, gdy tylko będzie dostępna.
        </p>
      </CardContent>
    </Card>
  );
}
