
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
            <FormLabel>Wiek (lata)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                inputMode="decimal"
                min="0" 
                step="1" 
                placeholder="np. 3" 
                {...field} 
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
            <FormLabel>Waga (kg)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                inputMode="decimal"
                min="0" 
                step="0.1" 
                placeholder="np. 15" 
                {...field} 
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
