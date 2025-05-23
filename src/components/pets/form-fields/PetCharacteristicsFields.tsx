
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control, useWatch } from "react-hook-form";
import { PetFormValues, PET_SEX } from "../PetFormSchema";
import { format, isValid } from "date-fns";

interface PetCharacteristicsFieldsProps {
  control: Control<PetFormValues>;
}

const PetCharacteristicsFields = ({ control }: PetCharacteristicsFieldsProps) => {
  // Monitor the neutered field value for conditional rendering
  const isNeutered = useWatch({
    control,
    name: "neutered",
    defaultValue: false,
  });

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="sex"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Płeć*</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                {PET_SEX.map((sex) => (
                  <div key={sex} className="flex items-center space-x-2">
                    <RadioGroupItem value={sex} id={sex} />
                    <Label htmlFor={sex}>{sex.charAt(0).toUpperCase() + sex.slice(1)}</Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="neutered"
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
                Sterylizowany/kastrowany
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Conditional rendering of neutering date field */}
      {isNeutered && (
        <FormField
          control={control}
          name="neuteringDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data sterylizacji*</FormLabel>
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
      )}
    </div>
  );
};

export default PetCharacteristicsFields;
