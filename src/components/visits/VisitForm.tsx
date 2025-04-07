
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Visit } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define the schema for visit validation
const visitFormSchema = z.object({
  date: z.date({
    required_error: "Wybierz datę wizyty",
  }),
  type: z.string().min(1, "Wybierz typ wizyty"),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z.date().optional().nullable(),
});

type VisitFormValues = z.infer<typeof visitFormSchema>;

interface VisitFormProps {
  petId: string;
  clientId: string;
  defaultValues?: Partial<VisitFormValues>;
  onSubmit: (data: VisitFormValues) => void;
  isSubmitting?: boolean;
}

const visitTypes = [
  "Kontrola",
  "Szczepienie",
  "Zabieg",
  "Konsultacja",
  "Badanie diagnostyczne",
  "Inny",
];

const VisitForm = ({ petId, clientId, defaultValues, onSubmit, isSubmitting = false }: VisitFormProps) => {
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      date: new Date(),
      type: "Konsultacja",
      notes: "",
      recommendations: "",
      followUpNeeded: false,
      followUpDate: null,
      ...defaultValues,
    },
  });

  const watchFollowUpNeeded = form.watch("followUpNeeded");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data wizyty*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: pl })
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typ wizyty*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ wizyty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {visitTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <FormLabel>Notatki z wizyty</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Obserwacje, przeprowadzone badania, procedury..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zalecenia</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Zalecenia dla właściciela..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="followUpNeeded"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Potrzebna wizyta kontrolna
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchFollowUpNeeded && (
          <FormField
            control={form.control}
            name="followUpDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data wizyty kontrolnej</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: pl })
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date <= new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz wizytę"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VisitForm;
