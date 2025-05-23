
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { PetFormValues } from "../PetFormSchema";
import { format, isValid } from "date-fns";

interface PetMeasurementsFieldsProps {
  control: Control<PetFormValues>;
}

const PetMeasurementsFields = ({ control }: PetMeasurementsFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data urodzenia*</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="DD-MM-RRRR"
                {...field}
                value={field.value && isValid(field.value as Date) 
                  ? format(field.value as Date, "yyyy-MM-dd") 
                  : ""}
                onChange={(e) => {
                  const dateString = e.target.value;
                  const date = dateString ? new Date(dateString) : undefined;
                  field.onChange(date);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Waga (kg)*</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                inputMode="decimal"
                placeholder="np. 15,5" 
                {...field}
                onChange={(e) => {
                  // Allow empty value, decimal numbers with dot or comma
                  const value = e.target.value;
                  if (value === '' || /^[0-9]*[.,]?[0-9]*$/.test(value)) {
                    // Internally store with dot for consistency, but display with comma
                    field.onChange(value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PetMeasurementsFields;
