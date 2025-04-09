
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { PetFormValues, PET_SEX } from "../PetFormSchema";

interface PetCharacteristicsFieldsProps {
  control: Control<PetFormValues>;
}

const PetCharacteristicsFields = ({ control }: PetCharacteristicsFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="sex"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Płeć</FormLabel>
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
    </>
  );
};

export default PetCharacteristicsFields;
