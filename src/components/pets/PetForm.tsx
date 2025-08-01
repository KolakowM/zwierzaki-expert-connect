import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petFormSchema, PetFormValues } from "./PetFormSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useCanPerformAction } from "@/hooks/usePackageLimits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { forwardRef } from "react";

// Import field components
import PetBasicInfoFields from "./form-fields/PetBasicInfoFields";
import PetCharacteristicsFields from "./form-fields/PetCharacteristicsFields";
import PetMeasurementsFields from "./form-fields/PetMeasurementsFields";
import PetMedicalFields from "./form-fields/PetMedicalFields";
import VaccinationAndChipFields from "./form-fields/VaccinationAndChipFields";

interface PetFormProps {
  clientId: string;
  defaultValues?: Partial<PetFormValues>;
  onSubmit: (data: any) => void; // Accept the transformed data from zodResolver
  isSubmitting?: boolean;
  isEditing?: boolean;
  showSubmitButton?: boolean;
}

const PetForm = forwardRef<HTMLFormElement, PetFormProps>(({ 
  clientId, 
  defaultValues, 
  onSubmit, 
  isSubmitting = false, 
  isEditing = false,
  showSubmitButton = true 
}, ref) => {
  const { user } = useAuth();
  
  // Check package limits for pets
  const { 
    canPerform, 
    currentCount, 
    maxAllowed, 
    packageName,
    isLoading: limitsLoading 
  } = useCanPerformAction('pets');

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: "pies",
      breed: "",
      weight: "",
      sex: undefined,
      neutered: false,
      neuteringDate: null,
      medicalHistory: "",
      allergies: "",
      dietaryRestrictions: "",
      behavioralNotes: "",
      hasMicrochip: false,
      microchipNumber: "",
      vaccinationDescription: "",
      dateOfBirth: null,
      ...defaultValues,
    },
  });

  // Check if user can add new pets (only for new pets, not editing)
  const canAddPet = isEditing || canPerform;
  const limitReached = !isEditing && !canPerform;

  // Handle form submission - let zodResolver do the transformation
  const handleFormSubmit = (data: PetFormValues) => {
    // The zodResolver automatically transforms the data based on the schema
    // No need to cast - just pass the transformed data directly
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form ref={ref} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {limitReached && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Osiągnięto limit zwierząt ({currentCount}/{maxAllowed}) w pakiecie {packageName}. 
              Nie można dodać więcej zwierząt. Ulepsz pakiet, aby zwiększyć limit.
            </AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <PetBasicInfoFields control={form.control} />

        {/* Characteristics */}
        <PetCharacteristicsFields control={form.control} />

        {/* Measurements */}
        <PetMeasurementsFields control={form.control} />

        {/* Medical Information */}
        <PetMedicalFields control={form.control} />

        {/* Vaccination and Microchip */}
        <VaccinationAndChipFields control={form.control} />

        {showSubmitButton && (
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || limitsLoading || (!isEditing && limitReached)}
            >
              {isSubmitting ? "Zapisywanie..." : (isEditing ? "Aktualizuj dane zwierzaka" : "Zapisz dane zwierzaka")}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
});

PetForm.displayName = "PetForm";

export default PetForm;
