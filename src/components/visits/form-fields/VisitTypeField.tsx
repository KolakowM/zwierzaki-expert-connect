
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface VisitTypeFieldProps {
  form: UseFormReturn<any>;
}

const visitTypes = [
  "Kontrola",
  "Szczepienie",
  "Zabieg",
  "Konsultacja",
  "Badanie diagnostyczne",
  "Inny",
];

const VisitTypeField = ({ form }: VisitTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Typ wizyty*</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz typ wizyty" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {visitTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VisitTypeField;
