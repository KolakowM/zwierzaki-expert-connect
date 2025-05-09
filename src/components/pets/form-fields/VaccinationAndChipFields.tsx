
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PetFormValues } from "../PetFormSchema";
import { useState, useEffect } from "react";

interface VaccinationAndChipFieldsProps {
  control: Control<PetFormValues>;
}

const VaccinationAndChipFields = ({ control }: VaccinationAndChipFieldsProps) => {
  const [hasMicrochip, setHasMicrochip] = useState(false);

  return (
    <div>
      <h3 className="text-base font-semibold mb-4 mt-6">Identyfikacja i szczepienia</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="hasMicrochip"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setHasMicrochip(!!checked);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Posiada mikrochip</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {hasMicrochip && (
          <FormField
            control={control}
            name="microchipNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer mikrochipa</FormLabel>
                <FormControl>
                  <Input placeholder="Numer mikrochipa" maxLength={15} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="vaccinationDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Historia szczepień</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informacje o szczepieniach zwierzęcia"
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default VaccinationAndChipFields;
