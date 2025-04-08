
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface VisitTimeFieldProps {
  form: UseFormReturn<any>;
}

const VisitTimeField = ({ form }: VisitTimeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Godzina wizyty</FormLabel>
          <div className="relative">
            <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="time"
              className="pl-8"
              {...field} 
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VisitTimeField;
