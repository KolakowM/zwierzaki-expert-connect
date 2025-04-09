
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { PET_SPECIES, PetFormValues } from "../PetFormSchema";

interface PetBasicInfoFieldsProps {
  control: Control<PetFormValues>;
}

const PetBasicInfoFields = ({ control }: PetBasicInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imię zwierzaka*</FormLabel>
            <FormControl>
              <Input placeholder="Azor" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gatunek*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz gatunek" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PET_SPECIES.map((species) => (
                    <SelectItem key={species} value={species}>
                      {species.charAt(0).toUpperCase() + species.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rasa</FormLabel>
              <FormControl>
                <Input placeholder="np. Labrador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default PetBasicInfoFields;
