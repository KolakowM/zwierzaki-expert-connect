
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Client } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCanPerformAction } from "@/hooks/usePackageLimits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Define the schema for client validation
const clientFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postCode: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => void;
  isSubmitting?: boolean;
  isEditing?: boolean;
}

const ClientForm = ({ defaultValues, onSubmit, isSubmitting = false, isEditing = false }: ClientFormProps) => {
  // Check package limits for clients
  const { 
    canPerform, 
    currentCount, 
    maxAllowed, 
    packageName,
    isLoading: limitsLoading 
  } = useCanPerformAction('clients');

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postCode: "",
      notes: "",
      ...defaultValues,
    },
  });

  // Check if user can add new clients (only for new clients, not editing)
  const canAddClient = isEditing || canPerform;
  const limitReached = !isEditing && !canPerform;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {limitReached && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Osiągnięto limit klientów ({currentCount}/{maxAllowed}) w pakiecie {packageName}. 
              Nie można dodać więcej klientów. Ulepsz pakiet, aby zwiększyć limit.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię*</FormLabel>
                <FormControl>
                  <Input placeholder="Jan" {...field} />
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
                <FormLabel>Nazwisko*</FormLabel>
                <FormControl>
                  <Input placeholder="Kowalski" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jan.kowalski@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="123 456 789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres</FormLabel>
              <FormControl>
                <Input placeholder="ul. Przykładowa 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miejscowość</FormLabel>
                <FormControl>
                  <Input placeholder="Warszawa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kod pocztowy</FormLabel>
                <FormControl>
                  <Input placeholder="00-000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notatki</FormLabel>
              <FormControl>
                <Textarea placeholder="Dodatkowe informacje o kliencie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting || limitsLoading || (!isEditing && limitReached)}
          >
            {isSubmitting ? "Zapisywanie..." : (isEditing ? "Aktualizuj dane klienta" : "Zapisz dane klienta")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
