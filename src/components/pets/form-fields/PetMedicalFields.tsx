
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { PetFormValues } from "../PetFormSchema";

interface PetMedicalFieldsProps {
  control: Control<PetFormValues>;
}

const PetMedicalFields = ({ control }: PetMedicalFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="medicalHistory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Historia medyczna</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Wcześniejsze choroby, zabiegi, operacje..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alergie</FormLabel>
            <FormControl>
              <Textarea placeholder="Znane alergie..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="dietaryRestrictions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ograniczenia dietetyczne</FormLabel>
            <FormControl>
              <Textarea placeholder="Specjalna dieta, ograniczenia żywieniowe..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="behavioralNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Uwagi dotyczące zachowania</FormLabel>
            <FormControl>
              <Textarea placeholder="Informacje o zachowaniu zwierzaka..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PetMedicalFields;
