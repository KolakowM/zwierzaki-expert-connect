
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { petFormSchema, PetFormValues, PetFormOutput } from "./PetFormSchema";
import PetBasicInfoFields from "./form-fields/PetBasicInfoFields";
import PetMeasurementsFields from "./form-fields/PetMeasurementsFields";
import PetCharacteristicsFields from "./form-fields/PetCharacteristicsFields";
import PetMedicalFields from "./form-fields/PetMedicalFields";

interface PetFormProps {
  clientId: string;
  defaultValues?: Partial<PetFormValues>;
  onSubmit: (data: PetFormOutput) => void;
  isSubmitting?: boolean;
}

const PetForm = ({ clientId, defaultValues, onSubmit, isSubmitting = false }: PetFormProps) => {
  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: "pies",
      breed: "",
      age: "",
      weight: "",
      sex: undefined,
      neutered: false,
      medicalHistory: "",
      allergies: "",
      dietaryRestrictions: "",
      behavioralNotes: "",
      ...defaultValues,
    },
  });

  // Pass form data through the schema's transform to convert string values to numbers
  const handleSubmit = (values: PetFormValues) => {
    const result = petFormSchema.safeParse(values);
    if (result.success) {
      onSubmit(result.data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Basic information fields */}
        <PetBasicInfoFields control={form.control} />
        
        {/* Measurements fields */}
        <PetMeasurementsFields control={form.control} />
        
        {/* Characteristics fields */}
        <PetCharacteristicsFields control={form.control} />
        
        {/* Medical information fields */}
        <PetMedicalFields control={form.control} />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz dane zwierzaka"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PetForm;
