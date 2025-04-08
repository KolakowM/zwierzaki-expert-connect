
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Plus } from "lucide-react";
import { format, isToday, parseISO } from "date-fns";
import { Visit, Client, Pet } from "@/types";
import { mockClients, mockPets, mockVisits } from "@/data/mockData";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

const CalendarTab = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [visits, setVisits] = useState<Visit[]>(mockVisits);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showVisitDetails, setShowVisitDetails] = useState(false);

  // Filter visits for the selected date
  const visitsForSelectedDate = date 
    ? visits.filter(visit => {
        const visitDate = new Date(typeof visit.date === 'string' ? visit.date : visit.date);
        return (
          visitDate.getDate() === date.getDate() &&
          visitDate.getMonth() === date.getMonth() &&
          visitDate.getFullYear() === date.getFullYear()
        );
      })
    : [];

  // Mark days with visits
  const isDayWithVisit = (day: Date) => {
    return visits.some(visit => {
      const visitDate = new Date(typeof visit.date === 'string' ? visit.date : visit.date);
      return (
        visitDate.getDate() === day.getDate() &&
        visitDate.getMonth() === day.getMonth() &&
        visitDate.getFullYear() === day.getFullYear()
      );
    });
  };

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
    type: z.string({
      required_error: "Proszę podać typ wizyty",
    }),
    notes: z.string().optional(),
  });

  // Form for new appointments
  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: date,
      notes: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof appointmentSchema>) => {
    // Format date and time
    const appointmentDateTime = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes);

    // Create new visit
    const newVisit: Visit = {
      id: `visit-${Date.now()}`,
      petId: data.petId,
      clientId: data.clientId,
      date: appointmentDateTime.toISOString(),
      type: data.type,
      notes: data.notes,
    };

    // Add to visits
    setVisits([...visits, newVisit]);
    
    toast({
      title: "Wizyta dodana",
      description: `Wizyta została zaplanowana na ${format(appointmentDateTime, "dd.MM.yyyy")} o ${data.time}`,
    });
    
    setShowNewAppointment(false);
    form.reset();
  };

  // Find client and pet for a visit
  const getVisitDetails = (visit: Visit) => {
    const client = mockClients.find(c => c.id === visit.clientId);
    const pet = mockPets.find(p => p.id === visit.petId);
    return { client, pet };
  };

  // Helper function to format date that handles both string and Date objects
  const formatVisitDate = (dateValue: string | Date) => {
    return format(typeof dateValue === 'string' ? parseISO(dateValue) : dateValue, "HH:mm");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Kalendarz</CardTitle>
          <CardDescription>
            Wybierz datę, aby zobaczyć wizyty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasVisit: (day) => isDayWithVisit(day),
                today: (day) => isToday(day)
              }}
              modifiersStyles={{
                hasVisit: { fontWeight: "bold", textDecoration: "underline" },
                today: { border: "2px solid currentColor", borderRadius: "50%" }
              }}
            />
          </div>
          <Button className="w-full" onClick={() => setShowNewAppointment(true)}>
            <Plus size={16} className="mr-2" />
            Nowa wizyta
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            Wizyty na {date ? format(date, "dd.MM.yyyy") : "wybrany dzień"}
          </CardTitle>
          <CardDescription>
            {visitsForSelectedDate.length > 0
              ? `${visitsForSelectedDate.length} ${
                  visitsForSelectedDate.length === 1 ? "wizyta" : "wizyty"
                } zaplanowane`
              : "Brak wizyt na ten dzień"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visitsForSelectedDate.length > 0 ? (
            <div className="space-y-4">
              {visitsForSelectedDate.map((visit) => {
                const { client, pet } = getVisitDetails(visit);
                const visitTime = formatVisitDate(visit.date);
                return (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => {
                      setSelectedVisit(visit);
                      setShowVisitDetails(true);
                    }}
                  >
                    <div>
                      <p className="font-medium">{visitTime} - {visit.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet?.name} ({client?.firstName} {client?.lastName})
                      </p>
                    </div>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 border border-dashed rounded-md">
              <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Brak wizyt na ten dzień
              </p>
              <Button 
                variant="link" 
                onClick={() => setShowNewAppointment(true)}
              >
                Dodaj wizytę
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add new appointment dialog */}
      <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
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
                      >
                        <option value="" disabled>
                          Wybierz klienta
                        </option>
                        {mockClients.map((client) => (
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
                        disabled={!form.watch("clientId")}
                      >
                        <option value="" disabled>
                          Wybierz zwierzę
                        </option>
                        {mockPets
                          .filter(
                            (pet) => pet.clientId === form.watch("clientId")
                          )
                          .map((pet) => (
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
                        <Input type="time" {...field} />
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
                      <Input placeholder="np. Badanie kontrolne" {...field} />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowNewAppointment(false)}>
                  Anuluj
                </Button>
                <Button type="submit">Zapisz wizytę</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Visit details dialog */}
      <Dialog open={showVisitDetails} onOpenChange={setShowVisitDetails}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedVisit && (
            <>
              <DialogHeader>
                <DialogTitle>Szczegóły wizyty</DialogTitle>
                <DialogDescription>
                  Informacje o zaplanowanej wizycie
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {(() => {
                  const { client, pet } = getVisitDetails(selectedVisit);
                  return (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Data i godzina</p>
                        <p>{format(
                            typeof selectedVisit.date === 'string' 
                              ? new Date(selectedVisit.date) 
                              : selectedVisit.date, 
                            "dd.MM.yyyy, HH:mm"
                          )}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Typ wizyty</p>
                        <p>{selectedVisit.type}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Klient</p>
                        <p>
                          {client ? `${client.firstName} ${client.lastName}` : "Nieznany klient"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Zwierzę</p>
                        <p>
                          {pet ? `${pet.name} (${pet.species}, ${pet.breed || "nieznana rasa"})` : "Nieznane zwierzę"}
                        </p>
                      </div>

                      {selectedVisit.notes && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Notatki</p>
                          <p className="text-sm">{selectedVisit.notes}</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowVisitDetails(false)}
                >
                  Zamknij
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setVisits(visits.filter(v => v.id !== selectedVisit.id));
                    setShowVisitDetails(false);
                    toast({
                      title: "Wizyta anulowana",
                      description: "Wizyta została usunięta z kalendarza",
                    });
                  }}
                >
                  Anuluj wizytę
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarTab;
