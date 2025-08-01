
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Visit } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVisit } from "@/services/visitService";
import { useQuery } from "@tanstack/react-query";
import { getPetsByClientId } from "@/services/petService";
import { format } from "date-fns";

// Type definitions
interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | undefined;
  clients: any[];
}

// Predefined visit types
const visitTypes = [
  "Kontrola",
  "Szczepienie",
  "Zabieg",
  "Konsultacja",
  "Badanie diagnostyczne",
  "Inny",
] as const;

type VisitType = typeof visitTypes[number];

// Form schema definition
const appointmentSchema = z.object({
  clientId: z.string({
    required_error: "Proszę wybrać klienta",
  }),
  petId: z.string({
    required_error: "Proszę wybrać zwierzę",
  }),
  date: z.date({
    required_error: "Proszę wybrać datę",
  }),
  time: z.string({
    required_error: "Proszę wybrać godzinę",
  }),
  type: z.enum(visitTypes, {
    required_error: "Proszę wybrać typ wizyty",
  }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const AppointmentForm = ({ isOpen, onClose, selectedDate, clients }: AppointmentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  
  // Form initialization - removed default values for type field
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: selectedDate,
      notes: "",
      clientId: "",
      petId: "",
      // Removed type default value to force user selection
    },
  });

  // Fetch client's pets
  const {
    data: clientPets = [],
    isLoading: isLoadingClientPets,
  } = useQuery({
    queryKey: ['pets', selectedClientId],
    queryFn: () => getPetsByClientId(selectedClientId),
    enabled: !!selectedClientId,
  });

  // Create visit mutation
  const createVisitMutation = useMutation({
    mutationFn: (newVisit: Omit<Visit, 'id'>) => {
      return createVisit(newVisit);
    },
    onSuccess: () => {
      handleSuccessfulSubmit();
    },
    onError: (error) => {
      handleSubmitError(error);
    }
  });

  // Success handler
  const handleSuccessfulSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ['visits'] });
    toast({
      title: "Wizyta dodana",
      description: "Wizyta została pomyślnie zaplanowana",
    });
    onClose();
    form.reset();
    setSelectedClientId(""); // Reset selected client
  };

  // Error handler
  const handleSubmitError = (error: any) => {
    console.error("Error creating visit:", error);
    toast({
      title: "Błąd",
      description: "Nie udało się dodać wizyty",
      variant: "destructive",
    });
  };

  // Handle client selection
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    form.setValue('petId', '');
  };

  // Handle dialog close
  const handleClose = () => {
    form.reset();
    setSelectedClientId("");
    onClose();
  };

  // Form submission handler
  const onSubmit = (data: AppointmentFormValues) => {
    // Format date and time
    const appointmentDateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes);

    // Create new visit
    const newVisit: Omit<Visit, 'id'> = {
      petId: data.petId,
      clientId: data.clientId,
      date: appointmentDateTime,
      time: data.time,
      type: data.type,
      notes: data.notes || null,
      recommendations: null,
      followUpNeeded: false,
      followUpDate: null
    };

    createVisitMutation.mutate(newVisit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nowa wizyta</DialogTitle>
          <DialogDescription>
            Dodaj nową wizytę do kalendarza. Wypełnij wszystkie wymagane pola.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Client Selection */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klient</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleClientChange(e.target.value);
                      }}
                      disabled={createVisitMutation.isPending}
                    >
                      <option value="" disabled>
                        Wybierz klienta
                      </option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.firstName} {client.lastName}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pet Selection */}
            <FormField
              control={form.control}
              name="petId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zwierzę</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={!selectedClientId || isLoadingClientPets || createVisitMutation.isPending}
                    >
                      <option value="" disabled>
                        {isLoadingClientPets 
                          ? "Ładowanie zwierząt..." 
                          : !selectedClientId 
                            ? "Najpierw wybierz klienta" 
                            : clientPets.length === 0
                              ? "Brak zwierząt dla tego klienta"
                              : "Wybierz zwierzę"
                        }
                      </option>
                      {clientPets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          field.onChange(date);
                        }}
                        disabled={createVisitMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Godzina</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        disabled={createVisitMutation.isPending} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Visit Type Selection - removed defaultValue */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typ wizyty</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={createVisitMutation.isPending}
                    >
                      <option value="" disabled selected>
                        Wybierz typ wizyty
                      </option>
                      {visitTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes Field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notatki</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Dodatkowe informacje o wizycie"
                      {...field}
                      disabled={createVisitMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Buttons */}
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={createVisitMutation.isPending}
              >
                Anuluj
              </Button>
              <Button 
                type="submit" 
                disabled={createVisitMutation.isPending}
              >
                {createVisitMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Zapisywanie...
                  </>
                ) : "Zapisz wizytę"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;
