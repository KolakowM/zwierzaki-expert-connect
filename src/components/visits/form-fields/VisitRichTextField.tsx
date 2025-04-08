
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Controller, UseFormReturn } from "react-hook-form";

interface VisitRichTextFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
}

const VisitRichTextField = ({ form, name, label, placeholder }: VisitRichTextFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Controller
              name={name}
              control={form.control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={placeholder}
                  className="min-h-[150px]"
                />
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VisitRichTextField;
