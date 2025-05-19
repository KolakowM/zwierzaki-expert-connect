
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

// Convert the readonly array to a tuple type that Zod can use
type VisitType = typeof visitTypes[number];

// Appointment form schema
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

const AppointmentForm = ({ isOpen, onClose, selectedDate, clients }: AppointmentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  
  // Form for new appointments
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: selectedDate,
      notes: "",
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast({
        title: "Wizyta dodana",
        description: "Wizyta została pomyślnie zaplanowana",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating visit:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się dodać wizyty",
        variant: "destructive",
      });
    }
  });

  // Handle client selection in the form
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    // Reset pet selection when changing client
    form.setValue('petId', '');
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof appointmentSchema>) => {
    // Format date and time
    const appointmentDateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes);

    // Create new visit
    const newVisit: Omit<Visit, 'id'> = {
      petId: data.petId,
      clientId: data.clientId,
      date: appointmentDateTime.toISOString(),
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nowa wizyta</DialogTitle>
          <DialogDescription>
            Dodaj nową wizytę do kalendarza. Wypełnij wszystkie wymagane pola.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input type="time" {...field} disabled={createVisitMutation.isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <option value="" disabled>
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

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
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
