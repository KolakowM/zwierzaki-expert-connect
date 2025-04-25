
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { mapDbVisitToVisit } from "@/types";

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
  const [existingVisits, setExistingVisits] = useState<Visit[]>([]);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);

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

  const watchDate = form.watch("date");
  const watchFollowUpNeeded = form.watch("followUpNeeded");

  // Fetch existing visits for the selected date
  useEffect(() => {
    const fetchVisitsForDate = async () => {
      if (!watchDate) return;
      
      try {
        setIsLoadingVisits(true);
        const selectedDate = new Date(watchDate);
        const dateString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        const { data, error } = await supabase
          .from('visits')
          .select('*')
          .gte('date', `${dateString}T00:00:00`)
          .lt('date', `${dateString}T23:59:59`);
          
        if (error) throw error;
        
        // Map database visit format to application Visit format
        const mappedVisits = data ? data.map(visit => mapDbVisitToVisit(visit)) : [];
        setExistingVisits(mappedVisits);
      } catch (error) {
        console.error('Error fetching visits:', error);
      } finally {
        setIsLoadingVisits(false);
      }
    };
    
    fetchVisitsForDate();
  }, [watchDate]);

  const handleFormSubmit = (data: VisitFormValues) => {
    // Check for time conflicts on the same date
    const conflictingVisits = existingVisits.filter(visit => {
      // Skip checking the current visit being edited
      if (defaultValues && 'id' in defaultValues && visit.id === defaultValues.id) {
        return false;
      }
      
      // Check if times overlap
      return visit.time === data.time;
    });
    
    if (conflictingVisits.length > 0) {
      form.setError('time', {
        type: 'manual',
        message: 'Ten termin jest już zajęty. Wybierz inną godzinę.'
      });
      return;
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
          <Button type="submit" disabled={isSubmitting || isLoadingVisits}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz wizytę"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VisitForm;
