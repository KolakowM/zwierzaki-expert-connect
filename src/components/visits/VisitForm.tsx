
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Visit } from "@/types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import VisitDateField from "./form-fields/VisitDateField";
import VisitTimeField from "./form-fields/VisitTimeField";
import VisitTypeField from "./form-fields/VisitTypeField";
import VisitRichTextField from "./form-fields/VisitRichTextField";
import VisitFollowUpField from "./form-fields/VisitFollowUpField";

// Define the schema for visit validation
const visitFormSchema = z.object({
  date: z.date({
    required_error: "Wybierz datę wizyty",
  }),
  time: z.string().optional(),
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

const VisitForm = ({ petId, clientId, defaultValues, onSubmit, isSubmitting = false }: VisitFormProps) => {
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      date: new Date(),
      time: "12:00",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VisitDateField 
            form={form} 
            name="date" 
            label="Data wizyty" 
            required 
          />
          <VisitTimeField form={form} />
          <VisitTypeField form={form} />
        </div>

        <VisitRichTextField
          form={form}
          name="notes"
          label="Notatki z wizyty"
          placeholder="Obserwacje, przeprowadzone badania, procedury..."
          
        />

        <VisitRichTextField
          form={form}
          name="recommendations"
          label="Zalecenia"
          placeholder="Zalecenia dla właściciela..."
          
        />

        <VisitFollowUpField 
          form={form} 
          watchFollowUpNeeded={watchFollowUpNeeded} 
        />

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
