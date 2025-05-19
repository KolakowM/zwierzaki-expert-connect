
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_VISIT_STATUSES } from "@/constants/visitStatuses";
import { UseFormReturn } from "react-hook-form";

interface VisitStatusFieldProps {
  form: UseFormReturn<any>;
  label?: string;
}

const VisitStatusField = ({ form, label = "Status wizyty" }: VisitStatusFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value || "Planowana"}
            value={field.value || "Planowana"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz status wizyty" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {ALL_VISIT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
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

export default VisitStatusField;
