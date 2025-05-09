
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PetFormValues } from "../PetFormSchema";
import { Microchip } from "lucide-react";

interface VaccinationAndChipFieldsProps {
  control: Control<PetFormValues>;
}

const VaccinationAndChipFields = ({ control }: VaccinationAndChipFieldsProps) => {
  return (
    <div className="space-y-4 border p-4 rounded-md bg-muted/10">
      <h3 className="font-medium text-lg">Informacje o szczepieniach i chipie</h3>
      
      {/* Vaccination Description Field */}
      <FormField
        control={control}
        name="vaccinationDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Historia szczepień</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Wprowadź informacje o szczepieniach zwierzęcia..."
                className="min-h-[120px]"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Microchip Switch Field */}
      <FormField
        control={control}
        name="hasMicrochip"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel className="flex items-center">
                <Microchip className="mr-2 h-4 w-4" />
                Posiada mikrochip
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Conditional Microchip Number Field */}
      <FormField
        control={control}
        name="microchipNumber"
        render={({ field, fieldState }) => (
          <FormItem className={field.value === undefined && !fieldState.isDirty ? "hidden" : ""}>
            <FormLabel>Numer mikrochipa</FormLabel>
            <FormControl>
              <Input 
                placeholder="Wprowadź numer mikrochipa..."
                {...field}
                value={field.value || ""}
                disabled={!control._formValues.hasMicrochip}
                maxLength={15}
                onChange={(e) => {
                  // Only allow digits
                  if (e.target.value === "" || /^\d*$/.test(e.target.value)) {
                    field.onChange(e);
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

export default VaccinationAndChipFields;
