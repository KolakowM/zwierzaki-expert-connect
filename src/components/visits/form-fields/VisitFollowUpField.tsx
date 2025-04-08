
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import VisitDateField from "./VisitDateField";

interface VisitFollowUpFieldProps {
  form: UseFormReturn<any>;
  watchFollowUpNeeded: boolean;
}

const VisitFollowUpField = ({ form, watchFollowUpNeeded }: VisitFollowUpFieldProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="followUpNeeded"
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
                Potrzebna wizyta kontrolna
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchFollowUpNeeded && (
        <VisitDateField
          form={form}
          name="followUpDate"
          label="Data wizyty kontrolnej"
          minDate={new Date()}
        />
      )}
    </>
  );
};

export default VisitFollowUpField;
