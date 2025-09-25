
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SpecializationCheckboxesProps {
  form: UseFormReturn<any>;
  maxAllowed: number;
  currentCount: number;
}

export function SpecializationCheckboxes({ form, maxAllowed, currentCount }: SpecializationCheckboxesProps) {
  // Fetch available specializations
  const { data: specializations = [], isLoading } = useQuery({
    queryKey: ['specializations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specializations')
        .select('*')
        .eq('active', 'yes')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="specializations"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">Specjalizacje</FormLabel>
            <FormDescription>
              Wybierz swoje specjalizacje weterynaryjne
            </FormDescription>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {specializations.map((specialization) => {
              const currentSpecializations = form.getValues('specializations') || [];
              const isSelected = currentSpecializations.includes(specialization.id);
              const wouldExceedLimit = !isSelected && currentCount >= maxAllowed;
              
              return (
                <FormField
                  key={specialization.id}
                  control={form.control}
                  name="specializations"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={specialization.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(specialization.id)}
                            disabled={wouldExceedLimit}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              return checked
                                ? field.onChange([...currentValue, specialization.id])
                                : field.onChange(
                                    currentValue?.filter(
                                      (value: string) => value !== specialization.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className={`text-sm font-normal ${wouldExceedLimit ? 'text-muted-foreground' : ''}`}>
                            {specialization.name}
                          </FormLabel>
                          {specialization.description && (
                            <p className="text-xs text-muted-foreground">
                              {specialization.description}
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )
                  }}
                />
              );
            })}
          </div>
        </FormItem>
      )}
    />
  );
}
