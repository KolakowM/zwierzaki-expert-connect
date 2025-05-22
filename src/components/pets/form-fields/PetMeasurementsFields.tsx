
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { PetFormValues } from "../PetFormSchema";

interface PetMeasurementsFieldsProps {
  control: Control<PetFormValues>;
}

const PetMeasurementsFields = ({ control }: PetMeasurementsFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Wiek (lata)*</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                inputMode="numeric"
                placeholder="np. 3"
                {...field}
                onChange={(e) => {
                  // Allow empty value or numbers only
                  const value = e.target.value;
                  if (value === '' || /^[0-9]+$/.test(value)) {
                    field.onChange(value);
                  }
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
                placeholder="np. 15" 
                {...field}
                onChange={(e) => {
                  // Allow empty value or decimal numbers
                  const value = e.target.value;
                  if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
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
